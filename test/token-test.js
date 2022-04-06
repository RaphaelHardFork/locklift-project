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

describe('Token contract', () => {
  describe('Contracts', () => {
    // --- SETUP ---
    before(async function () {
      this.timeout(20000)
      // --- users ---
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
      Wallet = await locklift.factory.getContract('TokenWallet')

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

    it('should create wallet by internal call', async () => {
      // await account.runTarget({ DO NOT WORK
      //   contract: token,
      //   method: 'mint',
      //   params: {
      //     _to: walletAddr,
      //     _tokens: '35000',
      //   },
      // })
      await token.run({
        method: 'mint',
        params: {
          _to: walletAddr,
          _tokens: '40000',
        },
        keyPair: keyPair,
      })
      Wallet.setAddress(walletAddr)

      expect((await Wallet.call({ method: 'getBalance' })).toString()).to.equal(
        '60000'
      )
    })

    // --- read ---
    // const response = await token.call({
    //   method: 'total_supply',
    //   params: {},
    // })
    // console.log('total supply', response.toString())

    // await account.runTarget({
    //   contract: token,
    //   method: 'deployEmptyWallet',
    //   params: {
    //     _wallet_public_key: `0x${keyPair.public}`,
    //     _deploy_evers: '1',
    //   },
    //   value: '100',
    // })

    //  console.log((await locklift.ton.getBalance(token.address)).toString())

    // -------- deployEmptyWallet
    // try {
    //   await token.run({
    //     method: 'deployEmptyWallet',
    //     params: {
    //       answerId: '10',
    //       _wallet_public_key: `0x${keyPair2.public}`,
    //       _deploy_evers: '100000000',
    //     },
    //     keyPair: keyPair,
    //   })
    // } catch (e) {
    //   console.log(e)
    // }
    // ---

    // const startBalance = await token.call({ method: 'start_gas_balance' })
    // console.log(startBalance.toString())
    // ------------------ mint
    // try {
    //   await token.run({
    //     method: 'mint',
    //     params: { _to: keyPair2.public, _tokens: '10' },
    //     keyPair: keyPair,
    //     value: '100000',
    //   })
    // } catch (e) {
    //   console.log(e)
    // }
    // ---
  })

  // it('Interact with contract', async function () {
  //   const response = await sample.call({
  //     method: 'getDetails',
  //     params: {},
  //   })

  //   expect(response.toNumber()).to.be.equal(111, 'Wrong state')
  // })
})
