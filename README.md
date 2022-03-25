# Locklift project

_[Locklift](https://github.com/broxus/ton-locklift) project from a proposed [template](https://github.com/EverscaleGuild/locklift-sample)_

## Requirements

- [yarn](https://yarnpkg.com/getting-started/install)
- [docker](https://www.docker.com/get-started)
- [everdev](https://github.com/tonlabs/everdev#installation)

## Commandes

```shell
yarn compile
yarn test
```

Change compiler version:

```json
// package.json
"everdev-setup": "everdev sol set --compiler 0.58.2 --linker 0.14.39",
```

## TVM ressources

Exemple of smart contracts written for TVM:

- https://github.com/broxus/ton-eth-bridge-token-contracts
- https://github.com/tonlabs/samples/tree/master/solidity

Solidity API: https://github.com/tonlabs/TON-Solidity-Compiler/blob/master/API.md

TVM description: https://test.ton.org/tvm.pdf

Solidity compiler (last 0.58.2): https://github.com/tonlabs/TON-Solidity-Compiler

VSCode extension for TON-Solidity: https://marketplace.visualstudio.com/items?itemName=everscale.solidity-support
