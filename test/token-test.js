/* eslint-disable comma-dangle */
/* eslint-disable mocha-no-only/mocha-no-only */
/* eslint-disable camelcase */
const { expect } = require('chai')

let Token,
  token,
  keyPair,
  keyPair2,
  keyPair3,
  Wallet,
  walletAddr,
  walletAddr2,
  Account,
  account

describe('Token contract', async function () {
  this.timeout(50000)
  describe('Contracts', async function () {
    // --- SETUP ---
    before(async function () {
      // --- users keypairs ---
      const keyList = await locklift.keys.getKeyPairs()
      keyPair = keyList[0]
      keyPair2 = keyList[1]
      keyPair3 = keyList[2]

      // --- Account.sol ---
      Account = await locklift.factory.getAccount('Account')
      account = await locklift.giver.deployContract({
        contract: Account,
        initParams: {
          __randomNonce: 5,
        },
        keyPair,
      })
      account.setKeyPair(keyPair)
      account.name = 'Owner'

      // --- deploy token contracts ---
      Token = await locklift.factory.getContract('TokenRoot')
      Wallet = await locklift.factory.getContract('TokenWallet') // deployed by TokenRoot

      token = await locklift.giver.deployContract({
        contract: Token,
        initParams: {
          wallet_code: Wallet.code,
        },
        keyPair,
      })

      // --- fill token contract ---
      await account.run({
        method: 'sendTransaction',
        params: {
          dest: token.address,
          value: 4500000000,
          bounce: true,
          flags: 1,
          payload: 'te6ccgEBAQEAAgAAAA==',
        },
      })

      // --- deploy wallet ---
      let tx = await token.run({
        method: 'deployWalletWithBalance',
        params: {
          _wallet_public_key: `0x${keyPair.public}`,
          _deploy_evers: '1000000000',
          _tokens: '20000',
        },
        keyPair: keyPair,
      })
      walletAddr = tx.decoded.output.value0

      // --- deploy wallet 2 ---
      tx = await token.run({
        method: 'deployWalletWithBalance',
        params: {
          _wallet_public_key: `0x${keyPair2.public}`,
          _deploy_evers: '1000000000',
          _tokens: '30000',
        },
        keyPair: keyPair,
      })
      walletAddr2 = tx.decoded.output.value0
    })

    it('Load contract factory & deploy contract', async function () {
      expect(Token.code).not.to.equal(undefined, 'Code should be available')
      expect(Token.abi).not.to.equal(undefined, 'ABI should be available')

      expect(token.address)
        .to.be.a('string')
        .and.satisfy((s) => s.startsWith('0:'), 'Bad future address')
    })

    it('should deploy token wallet', async () => {
      Wallet.setAddress(walletAddr)
      expect((await Wallet.call({ method: 'getBalance' })).toString()).to.equal(
        '20000'
      )
      Wallet.setAddress(walletAddr2)
      expect((await Wallet.call({ method: 'getBalance' })).toString()).to.equal(
        '30000'
      )
    })

    it('should transfer token', async () => {
      await Wallet.run({
        method: 'transferToRecipient',
        params: {
          _recipient_public_key: `0x${keyPair.public}`,
          _tokens: 5000,
          _deploy_evers: 100000000,
          _transfer_evers: 100000000,
        },
        keyPair: keyPair2,
      })

      expect((await Wallet.call({ method: 'getBalance' })).toString()).to.equal(
        '25000'
      )
      Wallet.setAddress(walletAddr)
      expect((await Wallet.call({ method: 'getBalance' })).toString()).to.equal(
        '25000'
      )
    })

    it('should create token wallet on the fly', async () => {
      await Wallet.run({
        method: 'transferToRecipient',
        params: {
          _recipient_public_key: `0x${keyPair3.public}`,
          _tokens: 5000,
          _deploy_evers: 100000000,
          _transfer_evers: 100000000,
        },
        keyPair: keyPair,
      })

      const walletAddr3 = await Wallet.call({
        method: 'getExpectedAddress',
        params: { _wallet_public_key: `0x${keyPair3.public}` },
      })
      Wallet.setAddress(walletAddr3)

      expect((await Wallet.call({ method: 'getBalance' })).toString()).to.equal(
        '5000'
      )
    })

    it('should mint token', async () => {
      const totalSupply = (
        await token.call({ method: 'total_supply' })
      ).toString()

      await token.run({
        method: 'mint',
        params: {
          _to: walletAddr,
          _tokens: '40000',
        },
        keyPair: keyPair,
      })

      expect(
        (await token.call({ method: 'total_supply' })).toNumber()
      ).to.equal(Number(totalSupply) + 40000)
    })

    it('should mint by internal message', async () => {
      const totalSupply = (
        await token.call({ method: 'total_supply' })
      ).toNumber()

      // external message
      await token.run({
        method: 'mint',
        params: {
          _to: walletAddr,
          _tokens: '40000',
        },
        keyPair: keyPair,
      })

      expect(
        (await token.call({ method: 'total_supply' })).toNumber(),
        'Minted by external message'
      ).to.equal(totalSupply + 40000)

      // internal message
      await account.runTarget({
        contract: token,
        method: 'mint',
        params: {
          _to: walletAddr,
          _tokens: '40000',
        },
        value: locklift.utils.convertCrystal(3, 'nano'),
        keyPair: keyPair,
      })

      expect(
        (await token.call({ method: 'total_supply' })).toNumber(),
        'Minted by internal message'
      ).to.equal(totalSupply + 40000 + 40000)
    })

    it('should not mint if not owner', async () => {
      // external message
      await expect(
        token.run({
          method: 'mint',
          params: {
            _to: walletAddr,
            _tokens: '40000',
          },
          keyPair: keyPair2,
        }),
        'ext message'
      )

      // internal message
      await expect(
        account.runTarget({
          contract: token,
          method: 'mint',
          params: {
            _to: walletAddr,
            _tokens: '40000',
          },
          value: locklift.utils.convertCrystal(3, 'nano'),
          keyPair: keyPair2,
        }),
        'int message'
      )
    })

    it('should call responsible function', async () => {
      await token.run({
        method: 'deployEmptyWallet',
        params: {
          answerID: '0x12345678',
          _recipient_public_key: `0x${keyPair3.public}`,
          _deploy_evers: 100000000,
        },

        value: locklift.utils.convertCrystal(3, 'nano'),
        keyPair: keyPair,
      })
    })
  })
})
