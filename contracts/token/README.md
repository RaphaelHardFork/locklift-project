# Deploy a token contract

_This contract is an imcomplete exemple of a TIP-3 token taken from [this guide](https://mnill.github.io/everscale-for-solidity-dev/), so it is not compatible with real TIP-3 tokens._

**Compile contract with `yarn compile` and work with output files in `build` folder.**

## Get TokenWallet code

We need to know the code of TokenWallet to calculate the address where we will deploy our token as TokenWallet code is a `static` variable of TokenRoot.sol:

```js
contract TokenRoot is ITokenRoot {
    uint128 public start_gas_balance;
    uint128 public total_supply;

    TvmCell static wallet_code;

    {...}
}
```

Consequently we can't get the address through this method:

```zsh
everdev contract info build/TokenRoot.tvc
```

The code is available in `TokenWallet.base64`, we can save it in a variable `wallet_code`:

```zsh
wallet_code=te6ccgECIgEABScABCSK7VMg4wMgwP/jAiDA/uMC8gsfAgEhA8TtRNDXScMB+GaJ+Gkh2zzTAAGOHYECANcYIPkBAdMAAZTT/wMBkwL4QuIg+GX5EPKoldMAAfJ64tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zzyPBcIAwR87UTQ10nDAfhmItDTA/pAMPhpqTgA+ER/b3GCCJiWgG9ybW9zcG90+GTjAiHHAOMCIdcNH/K8IeMDAds88jwcGxsDAiggghBIipcvu+MCIIIQe1eL9rvjAg4EAzwgghBJQTaluuMCIIIQaLVfP7rjAiCCEHtXi/a64wIMBwUD2DD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8IY4aI9DTAfpAMDHIz4cgzoIQ+1eL9s8Lgct/yXCOL/hEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAgGrPQPhEbxXPCx/Lf8n4RG8U4vsA4wDyAB4GDQAE+EwCLDD4Qm7jAPhG8nPR+ELy4GT4ANs88gAIHQIW7UTQ10nCAY6A4w0JHgJacO1E0PQFcSGAQPQOjoDfciKAQPQPjoDfcPhs+Gv4aoBA9A7yvdcL//hicPhjCwoBAoghAQKJFwN+MPhG8uBM+EJu4wAhk9TR0N7T/9HbPCGOHyPQ0wH6QDAxyM+HIM5xzwthAcjPkyUE2pbOzclw+wCRMOLjAPIAHhENACjtRNDT/9M/MfhDWMjL/8s/zsntVARQIIIQBm23iLrjAiCCEAs/z1e64wIgghAS2PJMuuMCIIIQSIqXL7rjAhoYEg8DPjD4RvLgTPhCbuMAIZPU0dDe03/T//pA0ds8MNs88gAeEB0BWAHbPPhJxwXy4Gn4TFigtX/4bCD6Qm8T1wv/nyDIz4WIzoBvz0DJgED7AN4wEQBqyMv/cG2AQPRD+EpxWIBA9Bb4S3JYgED0F8j0AMn4S8jPhID0APQAz4HJ+QDIz4oAQMv/ydADQjD4RvLgTPhCbuMAIZPU0dDe0//Tf9N/03/R2zww2zzyAB4THQP++EL4RSBukjBw3rry4GUiwgDy4GQi+Ey78uBmI/LgZyP4Qr3y4GT4J28QXyKgtX+88uBqIIIImJaAvvLgaPgAVQLIy/9wbYBA9EP4SnFYgED0FvhLcliAQPQXyPQAyfhLyM+EgPQA9ADPgcmJI8IAjoCcIfkAyM+KAEDL/8nQ4hcVFAByMfhMJaG1f/hs+Cj4QlUFVQRVA3/Iz4WAygDPhEDOAfoCcc8LalUgyM+RIipcvst/y//Ozclx+wBbAWJTEfkA+Cj6Qm8SyM+GQMoHy//J0AFTUcjPhYjOAfoCc88LaiHbPMzPkNFqvn/JcfsAFgA00NIAAZPSBDHe0gABk9IBMd70BPQE9ATRXwMAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABADNjD4RvLgTPhCbuMAIZPU0dDe03/R2zww2zzyAB4ZHQAk+Er4SccF8uBl+AD4TKC1f/hsAVAw0ds8+EwhjhyNBHAAAAAAAAAAAAAAAAAhm23iIMjOy3/JcPsA3vIAHgAK+Eby4EwCViHWHzH4RvLgTPhCbuMA+AAg0x8yghBIipcvupsg038y+EygtX/4bN4w2zweHQA0+Ev4SvhD+ELIy//LP8+Dzsz4TMjLf83J7VQAOu1E0NP/0z/TADH6QNTU0dDTf9H4bPhr+Gr4Y/hiAgr0pCD0oSEgABRzb2wgMC41OC4yAAA=
```

## Calculate address and deploy the contract

Now you can get the address of the future contract:

```zsh
everdev contract info build/TokenRoot -d wallet_code:$wallet_code
```

or deploy it directly:

```zsh
everdev contract deploy -v 1000000000 -d wallet_code:$wallet_code build/TokenRoot
```

`-d` is for data.

As for `wallet_code`, you can save the `root_address` in a variable:

```zsh
root_address=0:f9e...
```

## Interact with the contract

**Be aware of the balance of the contract, this can block you to interact with it.** You can topup it with:

```zsh
everdev contract topup -a $root_address -v amount
```

### Deploy wallet with balance

Get a new public key creating or reuse a signer

```zsh
everdev signer info SignerName
```

Then run function on the contract:

```zsh
everdev contract run build/TokenRoot -a $root_address
```

Input parameters:

```zsh
Available functions:

  1) constructor
  2) deployEmptyWallet
  3) mint
  4) deployWalletWithBalance
  5) start_gas_balance
  6) total_supply

  Select function (number): 4

Parameters of deployWalletWithBalance:

  _wallet_public_key (uint256): 0x2d7b2f8c14f4c4d6c2f12fe35b0173641d7d819033f572cfcba7c77d7e1a6fa3
  _deploy_evers (uint128): 100000000
  _tokens (uint128): 65000
```

Get the wallet address in the output (`value0`) and save it:

```zsh
    "output": {
        "value0": "0:8a0bbb3e0989c99c7e4be3d4be5db1d9d44149b9a2276646876e2a0e8352f364"
    },
    "out_messages": [
        {
            "body_type": "Input",
            "name": "constructor",
            "value": {},
            "header": null
        },
        null
    ]
}

wallet_address=0:8a0bbb3e0989c99c7e4be3d4be5db1d9d44149b9a2276646876e2a0e8352f364
```

### Use the Wallet

Check if the contract is deployed:

```zsh
everdev contract info -a $wallet_address
```

The balance shouldn't equal to zero.

```zsh
everdev contract run-local build/TokenWallet -a $wallet_address
```

The balance should be 65000.

### Make a transfer

```zsh
 everdev c run -s SignerName -a $wallet_address build/TokenWallet
```

```zsh
Available functions:

  1) constructor
  2) accept
  3) getBalance
  4) transferToRecipient
  5) internalTransfer
  6) getExpectedAddress
  7) balance

  Select function (number): 4

Parameters of transferToRecipient:

  _recipient_public_key (uint256): 0x7d7fa2970018e698eaad375f221f67262fde10b228eaf3d173a29977bfc7c52a
  _tokens (uint128): 30000
  _deploy_evers (uint128): 100000000
  _transfer_evers (uint128): 100000000
```

Don't forget to topup the contract, the method check if `address(this).balance > _deploy_evers + _transfer_evers`

> Public key must prefixed by `0x`

### Check the transfer result

There the smart contract for the recipient is created on the fly, here to get the address:

```zsh
everdev c run-local -a $wallet_address build/TokenWallet
```

And use `getExpectedAddress`

```zsh
Available functions:

  1) constructor
  2) accept
  3) getBalance
  4) transferToRecipient
  5) internalTransfer
  6) getExpectedAddress
  7) balance

  Select function (number): 6

Parameters of getExpectedAddress:

  _wallet_public_key (uint256): 0x7d7fa2970018e698eaad375f221f67262fde10b228eaf3d173a29977bfc7c52a

Execution has finished with result:
{
    "output": {
        "value0": "0:88f0ca324821fa75a184c15ec3b3df3c045b50163b3da0032efa1ea8abc17891"
    },
    "out_messages": []
}
```

Then you can check the balance of this wallet:

```zsh
everdev c run-local -a 0:88f0ca324821fa75a184c15ec3b3df3c045b50163b3da0032efa1ea8abc17891 /TokenWallet
```

```zsh
Available functions:

  1) constructor
  2) accept
  3) getBalance
  4) transferToRecipient
  5) internalTransfer
  6) getExpectedAddress
  7) balance

  Select function (number): 7

Execution has finished with result:
{
    "output": {
        "balance": "30000"
    },
    "out_messages": []
}
```
