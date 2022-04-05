/* eslint-disable mocha-no-only/mocha-no-only */
/* eslint-disable camelcase */
const { expect } = require('chai')

let Token, token, keyPair, keyPair2, Wallet, wallet, Account, account

describe('Token contract', () => {
  describe('Contracts', () => {
    // --- SETUP ---
    before(async function () {
      this.timeout(20000)
      // --- users ---
      const keyList = await locklift.keys.getKeyPairs()
      keyPair = keyList[0]
      keyPair2 = keyList[1]

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

      // --- contracts ---
      Token = await locklift.factory.getContract('TokenRoot')
      Wallet = await locklift.factory.getContract('TokenWallet')
      console.log(Wallet.code)

      token = await locklift.giver.deployContract({
        contract: Token,
        initParams: {
          wallet_code: Wallet.code,
        },
        keyPair,
      })

      console.log((await locklift.ton.getBalance(account.address)).toString())
      console.log((await locklift.ton.getBalance(token.address)).toString())
      // console.log(await locklift.ton.getBalance(`0x${keyPair.public}`))
      // console.log(await locklift.ton.getBalance(`0x${keyPair2.public}`))
      // console.log(locklift.ton.getBalance(keyPair.public))
      // console.log(locklift.ton.getBalance(keyPair.public))
      console.log('DEPLOYED')

      // --- deploy wallet ---
      await token.run({
        method: 'deployEmptyWallet',
        params: {
          answerID: '1',
          _wallet_public_key: `0x${keyPair.public}`,
          _deploy_evers: '1',
        },
        keyPair: keyPair,
      })
      // await account.runTarget({
      //   contract: token,
      //   method: 'deployEmptyWallet',
      //   params: {
      //     _wallet_public_key: `0x${keyPair.public}`,
      //     _deploy_evers: '1',
      //   },
      //   value: '100',
      // })
    })

    it('Load contract factory & deploy contract', async function () {
      expect(Token.code).not.to.equal(undefined, 'Code should be available')
      expect(Token.abi).not.to.equal(undefined, 'ABI should be available')

      expect(token.address)
        .to.be.a('string')
        .and.satisfy((s) => s.startsWith('0:'), 'Bad future address')
    })

    // it('should deploy token wallet', async () => {
    //   const pubkey = `0x${keyPair}`
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

    // --- read ---
    // const response = await token.call({
    //   method: 'deployWallet',
    //   params: {
    //     _wallet_public_key: `0x${keyPair.public}`,
    //     _deploy_evers: '1',
    //   },
    // })
    // console.log(response)

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
