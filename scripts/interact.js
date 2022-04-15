/* eslint-disable camelcase */
/* eslint-disable space-before-function-paren */

async function main() {
  // --- KEYPAIRS ---
  const [keyPair, keyPair2] = await locklift.keys.getKeyPairs()

  // --- ATTACH CONTRACT ADDRESS ---
  const Token = await locklift.factory.getContract('TokenRoot')
  Token.setAddress(
    '0:96be016e4d0446631f11b9ec01afba9a28d2ee4293e8d657b3988859370a7b32'
  )

  // --- CREATE WALLET ---
  const tx = await Token.run({
    method: 'deployWalletWithBalance',
    params: {
      _wallet_public_key: `0x${keyPair2.public}`,
      _deploy_evers: '1000000000',
      _tokens: '20000',
    },
    keyPair: keyPair,
  })

  console.log(
    'Actual balance: ',
    (await Token.call({ method: 'total_supply' })).toString()
  )

  console.log(
    `Wallet deployed at: ${tx.decoded.output.value0} for ${keyPair2.public}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
