/* eslint-disable camelcase */
require('dotenv').config()

const SEED = process.env.SEED_PHRASE
const SECRET = process.env.SECRET

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
        phrase: '',
        amount: 20,
      },
    },
    // ---------- TESTNET WITH CUSTOM GIVER (GiverV2.sol) -----------
    testnet: {
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
          header: ['time', 'expire'],
          functions: [
            {
              name: 'upgrade',
              inputs: [{ name: 'newcode', type: 'cell' }],
              outputs: [],
            },
            {
              name: 'sendTransaction',
              inputs: [
                { name: 'dest', type: 'address' },
                { name: 'value', type: 'uint128' },
                { name: 'bounce', type: 'bool' },
              ],
              outputs: [],
            },
            {
              name: 'getMessages',
              inputs: [],
              outputs: [
                {
                  components: [
                    { name: 'hash', type: 'uint256' },
                    { name: 'expireAt', type: 'uint64' },
                  ],
                  name: 'messages',
                  type: 'tuple[]',
                },
              ],
            },
            {
              name: 'constructor',
              inputs: [],
              outputs: [],
            },
          ],
          events: [],
        },
        key: SECRET,
      },
      keys: {
        phrase: SEED,
        amount: 1,
      },
    },
    // -------------- TESTNET WITH PUBLIC GIVER --------------
    dev: {
      ton_client: {
        network: {
          server_address: 'https://net.ton.dev/',
        },
      },
      giver: {
        address:
          '0:81af5e2c233986da3d051eadae4214238b54808765cebf890b1c5ba6c4f594b5',
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
        key: '796958882b7c83cf9e81554a31e6445e4fd20d65d9e82bf5a8290d961e2be6ef',
      },
      keys: {
        phrase:
          'canvas physical delay lend kitten film beauty board nerve scene arch upon',
        amount: 5,
      },
    },
  },
}
