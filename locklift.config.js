/* eslint-disable camelcase */
require('dotenv').config()

const SEED = process.env.SEED_PHRASE

module.exports = {
  compiler: {
    path: '~/.everdev/solidity/solc',
  },
  linker: {
    path: '~/.everdev/solidity/tvm_linker',
    lib: '~/.everdev/solidity/stdlib_sol.tvm',
  },
  networks: {
    local: {
      ton_client: {
        network: {
          server_address: 'http://localhost',
        },
      },
      giver: {
        address:
          '0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94',
        abi: {
          'ABI version': 1,
          functions: [
            { name: 'constructor', inputs: [], outputs: [] },
            {
              name: 'sendGrams',
              inputs: [
                { name: 'dest', type: 'address' },
                { name: 'amount', type: 'uint64' },
              ],
              outputs: [],
            },
          ],
          events: [],
          data: [],
        },
        key: '',
      },
      keys: {
        phrase:
          'canvas physical delay lend kitten film beauty board nerve scene arch upon',
        amount: 5,
      },
    },
    dev: {
      ton_client: {
        network: {
          server_address: 'https://net.ton.dev/',
        },
      },
      giver: {
        address:
          '0:9338d97c144bd7bc3b6edc8a2b8de00216f9c90b1d34180c49313fd94c140278',
        abi: {
          'ABI version': 2,
          header: ['pubkey', 'time', 'expire'],
          functions: [
            { name: 'constructor', inputs: [], outputs: [] },
            {
              name: 'sendGrams',
              inputs: [
                { name: 'dest', type: 'address' },
                { name: 'amount', type: 'uint64' },
              ],
              outputs: [],
            },
            {
              name: 'owner',
              inputs: [],
              outputs: [{ name: 'owner', type: 'uint256' }],
            },
          ],
          data: [{ key: 1, name: 'owner', type: 'uint256' }],
          events: [],
        },
        key: 'b373360846b7de322b30e3a027266c1473fdff9253b49f562153e6ba4090f893',
      },
      keys: {
        phrase: SEED,
        amount: 1,
      },
    },
  },
}
