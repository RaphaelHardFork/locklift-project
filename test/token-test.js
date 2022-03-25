/* eslint-disable mocha-no-only/mocha-no-only */
/* eslint-disable camelcase */
const { expect } = require('chai')

let Token, token, keyPair, keyPair2, Wallet, wallet

describe('Token contract', async function () {
  describe('Contracts', async function () {
    beforeAll(async function () {
      this.timeout(20000)
      const keyList = await locklift.keys.getKeyPairs()
      keyPair = keyList[0]
      keyPair2 = keyList[1]
      Wallet = await locklift.factory.getContract('Wallet')
      Token = await locklift.factory.getContract('Root')
      token = await locklift.giver.deployContract({
        contract: Token,
        initParams: {
          wallet_code: Wallet.code,
        },
        keyPair,
      })
    })

    it('Load contract factory & deploy contract', async function () {
      expect(Token.code).not.to.equal(undefined, 'Code should be available')
      expect(Token.abi).not.to.equal(undefined, 'ABI should be available')

      expect(token.address)
        .to.be.a('string')
        .and.satisfy((s) => s.startsWith('0:'), 'Bad future address')

      console.log((await locklift.ton.getBalance(token.address)).toString())

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

      const startBalance = await token.call({ method: 'start_gas_balance' })
      console.log(startBalance.toString())
      // ------------------ mint
      try {
        await token.run({
          method: 'mint',
          params: { _to: keyPair2.public, _tokens: '10' },
          keyPair: keyPair,
          value: '100000',
        })
      } catch (e) {
        console.log(e)
      }
      // ---
    })

    it('should mint token', async function () {
      this.timeout(20000)
    })

    // it('Interact with contract', async function () {
    //   const response = await sample.call({
    //     method: 'getDetails',
    //     params: {},
    //   })

    //   expect(response.toNumber()).to.be.equal(111, 'Wrong state')
    // })
  })
})
