/* eslint-disable camelcase */
/* eslint-disable space-before-function-paren */

async function main() {
  // --- KEYPAIRS ---
  const [keyPair, keyPair2] = await locklift.keys.getKeyPairs()

  // --- DEPLOY SAMPLE ---
  // const Sample = await locklift.factory.getContract('Sample')
  // const sample = await locklift.giver.deployContract({
  //   contract: Sample,
  //   constructorParams: {
  //     _state: 5,
  //   },
  //   initParams: {
  //     _nonce: 5,
  //   },
  //   keyPair,
  // })
  // console.log(`Contract Sample deployed at address: ${sample.address}`)

  // ---

  // --- DEPLOY TOKEN ---
  const Token = await locklift.factory.getContract('TokenRoot')
  const Wallet = await locklift.factory.getContract('TokenWallet')

  const token = await locklift.giver.deployContract({
    contract: Token,
    initParams: {
      wallet_code: Wallet.code,
    },
    keyPair,
  })

  console.log(`Token deployed at: ${token.address} by ${keyPair.public}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
