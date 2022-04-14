/* eslint-disable space-before-function-paren */

async function main() {
  const Token = await locklift.factory.getContract('TokenRoot')
  const Wallet = await locklift.factory.getContract('TokenWallet')
  const [keyPair] = await locklift.keys.getKeyPairs()

  console.log(keyPair)

  // process.exit(0)
  const token = await locklift.giver.deployContract({
    contract: Token,
    initParams: {
      wallet_code: Wallet.code,
    },
    keyPair,
  })

  console.log(`Token deployed at: ${token.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
