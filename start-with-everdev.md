# Start with EverScale

## TVM ressources

Exemple of smart contracts written for TVM:

- https://github.com/broxus/ton-eth-bridge-token-contracts
- https://github.com/tonlabs/samples/tree/master/solidity
- https://github.com/broxus/ton-dex/tree/master/contracts

Solidity API: https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md

TVM description: https://test.ton.org/tvm.pdf

Solidity compiler (last 0.58.2): https://github.com/tonlabs/TON-Solidity-Compiler

VSCode extension for TON-Solidity: https://marketplace.visualstudio.com/items?itemName=everscale.solidity-support

Guide to Ton development: https://mnill.github.io/everscale-for-solidity-dev/ **(Highly recommanded to understand well notions in this guide if you start developping on Everscale)**

## Everdev

Here the [API](https://github.com/tonlabs/everdev) of `everdev`

To install everdev:

```zsh
npm install -g everdev
```

Then install the docker image:

```zsh
everdev se update
everdev se start
```

Add a network:

```zsh
everdev network add name endpoint
```

endpoints:

- **local:** http://localhost
- **testnet/devnet:** net.ton.dev, net1.ton.dev, net5.ton.dev
- **mainnet:** main.ton.dev, main2.ton.dev, main3.ton.dev

Add a signer:

```zsh
everdev signer generate SignerName
```

Then you have to use a Giver, smart contract to deploy contract and send value.

## On local network

There are a givers built-in (associated with a signer) in the local network:

The `se_giver_signer` will be the signer for the giver at address: `0:b5e9240fc2d2f1ff8cbb1d1dee7fb7cae155e5f6320e585fcc685698994a19a5`

```zsh
everdev signer add se_giver_signer 172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3

everdev network giver localNetworkName 0:b5e9240fc2d2f1ff8cbb1d1dee7fb7cae155e5f6320e585fcc685698994a19a5 -s se_giver_signer
```

You can check signers and networks with `everdev s l` and `everdev n l`. And you can check every commands with `everdev -h`, `everdev signer -h`, `everdev network add -h`, ...

Then you can follow the [quick start quide](https://github.com/tonlabs/everdev/blob/main/docs/quick_start.md).

## On testnet

On testnet you have to deploy your own giver, the last version is this one: [GiverV2.sol](https://github.com/tonlabs/evernode-se/blob/master/contracts/giver_v2/GiverV2.sol) but not work with the lastest version of the compiler. So use directly the [compiled version of this contract](https://github.com/tonlabs/evernode-se/tree/master/contracts/giver_v2). So download `GiverV2.tvc` and `GiverV2.abi.json` and move it to your repo.

But first configure the network:

```zsh
everdev signer generate testnet_signer
everdev network add testnet net.ton.dev,net1.ton.dev,net5.ton.dev
```

`endpoints` must be only separated with ","

Then calculate the giver address (GiverV2.tvc must be in this repo):

```zsh
everdev contract info -n testnet -s testnet_signer GiverV2.tvc
```

The network is choose with `-n networkName` or you can set a default network with:

```zsh
everdev network default networkName
```

It work the same for signer, choose it with `-s signerName` and set default with:

```zsh
everdev signer default signerName
```

The address you got with `contract info` is the address of your giver on testnet, to deploy it, you need to before topup it with EVER. For that go on the Telegram account: @everdev_giver_bot (EverdevGiver) and ask:

```zsh
/give amount 0:ab55eab6a... (address)
```

You can check if the amount is sent by doing again the command `contract info`

Now you can deploy your giver:

```zsh
everdev contract deploy GiverV2.tvc
```

Then you can set it as your giver for the testnet:

```zsh
everdev network giver testnetName 0:ab55eab6a... -s testnet_signer
```

Try your giver by deploying `helloWorld` (as in local quick start guide), so:

- get the address
- topup it
- deploy it

```zsh
everdev contract info helloWorld
```

Check if you are on devnet/testnet with the right signer. And keep the address for the next line.

```zsh
everdev contract topup -a 0:abcabc... -v 2000000000 (2EVER)
```

`-a` is for address, you can use the .tvc file also, it will calculate the address on the fly.  
`-v` is used for value.

```zsh
everdev contract deploy helloWorld
everdev contract info helloWorld (check if deployed)
```

## Interact with the contract

There are **two way of interacting with the contract:**

- `run`: execute method
- `run-local`: read contract state

To work you need the ABI file, and parameters to get the address, so either:

- the address directly specified by `-a address`
- signer pubkey and initialData (this will calculate the address)

```zsh
everdev contract run-local helloWorld -a 0:address...
```

> You can call the constructor, but this is already called at the deployment, so it will produce an error: `exit code: 51 (Constructor was already called)`

Try `5) timestamp`

Then you can change this value by calling `touch`, as it's a write function you need to pass the `run` command:

```zsh
everdev contract run helloWorld -a:address...
```

Now you can see that the timestamp on the contract has change.

**[Deploy a more complexe contract with an exemple of token contract](https://github.com/RaphaelHardFork/locklift-project/tree/main/contracts/token)**

# Use TONOS-CLI

_Tonos-cli is another tool to interact with Everscale by command line. This is the more complete tool but it's only command line so we can't write script, doing unit tests. But it could be useful at some point, as locklift not cover some part of Everscale development._

## Installation

Follow the [installation guide](https://github.com/tonlabs/tonos-cli#install-through-everdev) (through Everdev)

Check installation:

```zsh
tonos-cli version
```

## Create key file

```zsh
tonos-cli genphrase
tonos-cli getkeypair yourFile.json "seed phrase"

cat yourFile.json (to check public/secret)
```

Set the path in the tonos-cli config

```zsh
tonos-cli config --keys yourFile.json
```

# Use TonClient (JS SDK)

Here the [TonClient](https://github.com/tonlabs/ever-sdk-js) documentation

In this [code exemple](https://github.com/mnill/everscale-account-decode-example/blob/master/test.js), TonClient is used to decode the contract and get `tvm.pubkey()`.

An other way to get this information from a contract is to implement a getter function:

```js
function getOwner() external view returns ( uint256 ) {
  return tvm.pubkey();
}
```

# Interact with Everscale on the front-end part

This repo create a web app with [Parcel](https://parceljs.org/): https://github.com/EverscaleGuild/everscale-tutor-web

This repo took some part of the above repo to create a React app: https://github.com/RaphaelHardFork/everscale-react-dapp

_These two exemple connect only with EVER wallet_
