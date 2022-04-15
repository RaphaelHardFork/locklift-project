// Using the GiverV2 to deploy contract
// from: https://github.com/broxus/ton-locklift/blob/master/locklift/giver/index.js

// DO NOT WORK

const main = async () => {
  // --- KEYPAIRS ---
  const [keyPair] = await locklift.keys.getKeyPairs()

  console.log(`Deploy with GiverV2 with ${keyPair.public}`)

  // --- DEPLOY SAMPLE ---
  const Sample = await locklift.factory.getContract('Sample')

  console.log(Sample.abi)

  const { address } = await this.locklift.ton.createDeployMessage({
    Sample,
    constructorParams: { _state: 5 },
    initParams: { _nonce: 5 },
    keyPair,
  })

  await locklift.giver.run({
    method: 'sendTransaction',
    params: {
      dest: address,
      amount: locklift.utils.convertCrystal(10, 'nano'),
      bounce: false,
    },
  })

  await locklift.ton.client.net.wait_for_collection({
    collection: 'accounts',
    filter: {
      id: { eq: address },
      balance: { gt: '0x0' },
    },
    result: 'balance',
  })

  const message = await locklift.ton.createDeployMessage({
    Sample,
    constructorParams: { _state: 5 },
    initParams: { _nonce: 5 },
    keyPair,
  })

  console.log('ABI')

  await locklift.ton.waitForRunTransaction({ message, abi: Sample.abi })

  const sample = Sample.setAddress(address)

  console.log(`Contract Sample deployed at address: ${sample.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
