Requirement:

- everdev cli
- local network (se) with docker
- follow the [quick start quide](https://github.com/tonlabs/everdev/blob/main/docs/quick_start.md) to configure the network, signers and givers on local network and also the [guide for devnet](https://github.com/tonlabs/everdev/blob/main/docs/work_with_devnet.md)

Check signer, givers and networks:
`everdev n l | everdev s l`

# Deploy contract via `everdev cli`

The network is chosen via `-n networkName`

## Compile the contract

`everdev sol compile ContractName.sol`

## Calculate the contract address

`everdev contract info -n networkName ContractName -d initialData:data`

Initiale data are used to calculate the address, these data correspond to `static` variable in the contract.

## Top up the contract

On the devnet you can use the faucet directly to topup the contract.

**On local network: how to send value to the contract from the giver?**
For the moment we can deploy contract by sending value at the deployment (see below)

`everdev contract topup -n networkName ContractName -d initialData:data -v 25000000000` (25 EVER)

## Deploy the contract

`everdev contract deploy -n networkName ContractName -d initialData:data`

To topup the contract at the same time you can add a value:

`everdev contract deploy -n networkName ContractName -d initialData:data -v 2000000000` (2,0 EVER)

## Run the contract

Run view function, get contract data:

`everdev contract run-local -n networkName ContractName -d initialData:data`

Run method by sending external call:

`everdev contract run -n networkName ContractName -d initialData:data`

# Use Locklift

Follow the [README](https://github.com/broxus/ton-locklift) to install locklift

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

Commands can be added in the `package.json`:

```json
  "scripts": {
    {...}
    "compile": "locklift build --config locklift.config.js",
    "test": "yarn contract-test"
  },
```

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

Get the public keypair as `uint`:

```js
const publicKeypair = `0x${keyPair.public}`;
```

### Deploy a contract

```js
Contract = await locklift.factory.getContract("ContractName");

contract = await locklift.giver.deployContract({
  contract: Token,
  initParams: {
    wallet_code: Wallet.code,
  },
  keyPair,
});
```

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

Problem: doing a call with this method seem to not affect the contract state

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
