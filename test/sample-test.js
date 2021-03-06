const { expect } = require('chai')

let Sample
let sample

const getRandomNonce = () => (Math.random() * 64000) | 0

describe('Test Sample contract', async function () {
  describe('Contracts', async function () {
    it('Load contract factory', async function () {
      Sample = await locklift.factory.getContract('Sample')

      expect(Sample.code).not.to.equal(undefined, 'Code should be available')
      expect(Sample.abi).not.to.equal(undefined, 'ABI should be available')
    })

    it('Deploy contract', async function () {
      this.timeout(20000)

      const [keyPair] = await locklift.keys.getKeyPairs()

      sample = await locklift.giver.deployContract({
        contract: Sample,
        constructorParams: {
          _state: 123,
        },
        initParams: {
          _nonce: getRandomNonce(),
        },
        keyPair,
      })

      expect(sample.address)
        .to.be.a('string')
        .and.satisfy((s) => s.startsWith('0:'), 'Bad future address')
    })

    it('Interact with contract', async function () {
      await sample.run({
        method: 'setState',
        params: { _state: 111 },
      })

      // to see what an empty cell look like
      // console.log(await sample.call({ method: 'viewTvmCell', params: {} }))

      const response = await sample.call({
        method: 'getDetails',
        params: {},
      })

      expect(response.toNumber()).to.be.equal(111, 'Wrong state')
    })

    it('send value from giver', async () => {
      const amount = 200000000
      const sampleBalance = await locklift.ton.getBalance(sample.address)
      await locklift.giver.giver.run({
        method: 'sendGrams',
        params: {
          dest: sample.address,
          amount,
        },
      })

      expect(
        (await locklift.ton.getBalance(sample.address)).toString()
      ).to.equal(sampleBalance.plus(499999).plus(amount).toString())
      // 499999 are also send when using this method
    })
  })
})
