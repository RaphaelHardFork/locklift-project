# Locklift project

_[Locklift](https://github.com/broxus/ton-locklift) project from a proposed [template](https://github.com/EverscaleGuild/locklift-sample)_

In this repo:

- [Start with everdev](https://github.com/RaphaelHardFork/locklift-project/blob/main/start-with-everdev.md)
- [Deploy a token contract with `everdev cli`](https://github.com/RaphaelHardFork/locklift-project/tree/main/contracts/token)

## Requirements

- [yarn](https://yarnpkg.com/getting-started/install)
- [docker](https://www.docker.com/get-started)
- [everdev](https://github.com/tonlabs/everdev#installation)
- [locklift](https://github.com/broxus/ton-locklift) installed

## Commands

Change compiler version:

```json
// package.json
"everdev-setup": "everdev sol set --compiler 0.58.2 --linker 0.14.39",
```

Compile and run tests:

```zsh
yarn compile
yarn test
```

Run scripts

```zsh
yarn run-s folder/file.js -n local|dev|networkName
```

The network must be specified when using `run-s`

You can change these command in `package.json`

# Use Locklift

Description of the locklift API in their [README](https://github.com/broxus/ton-locklift).

## Example of `locklift.config.js`

```js
module.exports = {
  compiler: {
    path: "~/.everdev/solidity/solc",
  },
  linker: {
    path: "~/.everdev/solidity/tvm_linker",
    lib: "~/.everdev/solidity/stdlib_sol.tvm",
  },
  networks: {
    local: {
      ton_client: {
        network: {
          server_address: "http://localhost",
        },
      },
      giver: {
        address:
          "0:841288ed3b55d9cdafa806807f02a0ae0c169aa5edfe88a789a6482429756a94",
        abi: {
          "ABI version": 1,
          functions: [
            { name: "constructor", inputs: [], outputs: [] },
            {
              name: "sendGrams",
              inputs: [
                { name: "dest", type: "address" },
                { name: "amount", type: "uint64" },
              ],
              outputs: [],
            },
          ],
          events: [],
          data: [],
        },
        key: "",
      },
      keys: {
        phrase:
          "canvas physical delay lend kitten film beauty board nerve scene arch upon",
        amount: 5,
      },
    },
    dev: {
      ton_client: {
        network: {
          server_address: "https://net.ton.dev/",
        },
      },
      giver: {
        address:
          "0:81af5e2c233986da3d051eadae4214238b54808765cebf890b1c5ba6c4f594b5",
        abi: {
          "ABI version": 2,
          header: ["pubkey", "time", "expire"],
          functions: [
            { name: "constructor", inputs: [], outputs: [] },
            {
              name: "sendGrams",
              inputs: [
                { name: "dest", type: "address" },
                { name: "amount", type: "uint64" },
              ],
              outputs: [],
            },
            {
              name: "owner",
              inputs: [],
              outputs: [{ name: "owner", type: "uint256" }],
            },
          ],
          data: [{ key: 1, name: "owner", type: "uint256" }],
          events: [],
        },
        key: "796958882b7c83cf9e81554a31e6445e4fd20d65d9e82bf5a8290d961e2be6ef",
      },
      keys: {
        phrase:
          "canvas physical delay lend kitten film beauty board nerve scene arch upon",
        amount: 5,
      },
    },
  },
};
```

_Locklift not support custom Giver ([GiverV2.sol](https://github.com/tonlabs/everdev/blob/main/docs/guides/work-with-devnet.md#compile-giver-code) for exemple)._

## Write contract

Follow this [guide](https://mnill.github.io/everscale-for-solidity-dev/) to know subtilities of the TVM and Solidity language extension.

And use this [extension (VSCode)](https://marketplace.visualstudio.com/items?itemName=everscale.solidity-support) for the Solidity under TVM.

## Write tests

The test file should look like:

```js
const { expect } = require("chai");

describe("Token contract", async function () {
  this.timeout(50000);
  describe("Contracts", async function () {
    before(async function () {});
  });
});
```

Always use ES5 function: `async function() {}` instead of `async() => {}` otherwise the `this.timeout(x)` do not work.

### Get keypair

```js
const keyList = await locklift.keys.getKeyPairs();
keyPair = keyList[0];
keyPair2 = keyList[1];
keyPair3 = keyList[2];
```

`keyList` is got from the `locklift.config.js`:

```js
module.exports = {
  {...},
  networks: {
    local: {
      {...},
      keys: {
        phrase:
          'canvas physical delay lend kitten film beauty board nerve scene arch upon',
        amount: 5,
      },
    },
  },
};
```

Public keys are ofter put in arguments as uint:

```js
const publicKeypair = `0x${keyPair.public}`;
```

### Deploy a contract

```js
Contract = await locklift.factory.getContract("ContractFileName"); // see in build folder

contract = await locklift.giver.deployContract({
  contract: Token,
  constructorParams: {},
  initParams: {
    wallet_code: Wallet.code,
  },
  keyPair,
});
```

Here the steps done by `deployContract`:

- Derives the future contract address
- Sends the specified amount of TONs to it's address
- Waits till the balance is sufficient
- Sends the contract deploy message

### Send value from giver

```js
const amount = 200000000;

await locklift.giver.giver.run({
  method: "sendGrams",
  params: {
    dest: sample.address,
    amount,
  },
});
```

_Whatever the amount, this method always send to the destination `499999` in addition to the amount._

### Read contract

```js
await contract.call({
  method: "getSomething",
  params: { _arg1: "", _arg2: 0 },
});
```

### Run method

```js
await contract.run({
  method: "runMethod",
  params: { _arg1: "", _arg2: 0 },
  keyPair: keyPair,
});
```

### Read a transaction

You can get transaction informations/outputs:

```js
const tx = await contract.run({
  method: "runMethod",
  params: { _arg1: "", _arg2: 0 },
  keyPair: keyPair,
});

const output = tx.decoded.output.value0;
```

### Attach a contract

Like `.at()` or `.attach()` in web3.js and ethers.js, when the contract is already deployed or deployed after calling a method.

```js
Contract = await locklift.factory.getContract("ContractName");

Contract.setAddress(contractAddress);
```

### Get contract balance

```js
const balance = (await locklift.ton.getBalance(contract.address)).toString();
```

### Test a revert

There is no way to test a revert like with hardhat so you can use a `try/catch` statement:

_Others methods should be used there to test a revert_

```js
let message = "transaction passed";
try {
  // internal message
  await account.runTarget({
    contract: token,
    method: "mint",
    params: {
      _to: walletAddr,
      _tokens: "40000",
    },
    value: 1500000000,
    keyPair: keyPair2,
  });
} catch (e) {
  message = e.message;
}

expect(message).to.equal(
  "Contract execution was terminated with error: Compute phase isn't succeeded, exit code: 1101.\n" +
    "Possible reason: Contract did not accept message.\n" +
    "Tip: For more information about exit code check the contract source code or ask the contract developer"
);
```

### Using `Account.sol`

You can use [Account.sol](https://github.com/broxus/ton-contracts/blob/master/contracts/wallets/Account.sol) to:

- send value to an account

Create an Account.sol file:

```js
pragma ton-solidity ^0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "@broxus/contracts/contracts/wallets/Account.sol";

contract MyAccount is Account {}
```

**DEPLOY ACCOUNT:**

```js
Account = await locklift.factory.getAccount("Account");
account = await locklift.giver.deployContract({
  contract: Account,
  initParams: {
    __randomNonce: 5,
  },
  keyPair,
});
account.setKeyPair(keyPair);
account.name = "Owner";
```

**SEND VALUE:**

```js
await account.run({
  method: "sendTransaction",
  params: {
    dest: contract.address,
    value: 4500000000,
    bounce: true,
    flags: 1,
    payload: "te6ccgEBAQEAAgAAAA==",
  },
});
```

`te6ccgEBAQEAAgAAAA==` correspond to an empty TVM cell

**SEND INTERNAL MESSAGE:**
You can send internal message to contract with Account.sol, use the `.runTarget()` method.

**Problem:** if the internal call revert, you can't see it on tests.

```js
await account.runTarget({
  contract: token,
  method: "deployWalletWithBalance",
  params: {
    _wallet_public_key: `0x${keyPair3.public}`,
    _deploy_evers: "1000000000",
    _tokens: "30000",
  },

  value: locklift.utils.convertCrystal(3, "nano"),
  keyPair: keyPair,
});
```

To check the status of a transaction you can go on http://localhost/transactions

### Responsible functions

> Our function is labelled responsible, this means that it is possible to be called with a smart contract and it will create a message with a callback. The compiler will simply add a field to the function arguments answerID, which shows the ID of the function that will be called by sending a message back to the msg.sender address.

> Why do we use 128 here and not 64 - because from this transaction we have two external calls, one is to deploy the wallet contract, and the second is the answer: responsible. You can find more details about this in the "Carefully working with value" section.

Calling "responsible" functions not work in tests, result always in:

`Create run message failed: Wrong data format: null`

## Configure Signer and Giver for deploying with script

Create a new signer with `everdev` cli:

```zsh
everdev signer generate signerName -m
```

`-m` you use a mnemonic seed phrase, you can get this phrase with:

```zsh
everdev signer info signerName
```

Save this phrase in your `.env` file and use it in `locklift.config.js`:

_You must install with `yarn add dotenv`_

```js
require("dotenv").config();

const SEED = process.env.SEED_PHRASE;

module.exports = {
  {...},
  networks: {
    dev: {
      {...},
      keys: {
        phrase: SEED,
        amount: 1,
      },
    },
  },
};
```

`.env` file:

```zsh
SEED_PHRASE="expose any bracket harsh couch neglect climb ignore ivory cancel area simple"
SECRET=b373360846b7de322b30e3a027266c1473fdff9253b49f562153e6ba4090f893
```

As for the moment, we can't integrate custom Giver in the config, it's better to write unit test with locklift and then deploy using `everdev cli`.

You can deploy with script on the testnet using a public giver, set on this `locklift.config.js` as the `dev` network.
