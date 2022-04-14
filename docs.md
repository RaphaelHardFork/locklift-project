# Start with EverScale

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

- local: http://localhost
- testnet/devnet: net.ton.dev, net1.ton.dev, net5.ton.dev
- mainnet: main.ton.dev, main2.ton.dev, main3.ton.dev

Add a signer:

```zsh
everdev signer generate SignerName
```

Then you have to use a Giver, smart contract to deploy contract and send value.

## On local network

There is a giver built-in (associated with a signer) in the local network:

The `se_giver_signer` will be the signer for the giver at address: `0:b5e9240fc2d2f1ff8cbb1d1dee7fb7cae155e5f6320e585fcc685698994a19a5`

```zsh
everdev signer add se_giver_signer 172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3

everdev network giver localNetworkName 0:b5e9240fc2d2f1ff8cbb1d1dee7fb7cae155e5f6320e585fcc685698994a19a5 -s se_giver_signer
```

You can check signers and networks with `everdev s l` and `everdev n l`. And you can check commands with `everdev -h`, `everdev signer -h`, `everdev network add -h`, ...

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

Try your giver by deploying `helloWorld` (from local quick start guide).

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

# Use TONOS-CLI

## Installation

Follow the [installation guide](https://github.com/tonlabs/tonos-cli#install-through-everdev)

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

# Interact with Everscale on the front-end part

https://github.com/EverscaleGuild/everscale-tutor-web
