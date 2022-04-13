# Deploy the token contract

Contract address is calculated from the code and `static` variable. Contracts above haven't `static` variable in their code.

In this repo there is a token contract which is the exemple of this [guide](https://mnill.github.io/everscale-for-solidity-dev/).

_Before you must compile contract with `yarn compile` and get output files in the build repo_

We can't get the address with the command:

```zsh
everdev contract info build/TokenRoot.tvc
```

You have to specify `static` variable, in TokenRoot.sol you only have one which is `wallet_code`, which is the code of the TokenWallet.sol. The code is available in `TokenWallet.base64`:

```zsh
te6ccgECJQEABVQAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsiBQQkA8TtRNDXScMB+GaJ+Gkh2zzTAAGOHYECANcYIPkBAdMAAZTT/wMBkwL4QuIg+GX5EPKoldMAAfJ64tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zzyPBoLBgR87UTQ10nDAfhmItDTA/pAMPhpqTgA+ER/b3GCCJiWgG9ybW9zcG90+GTjAiHHAOMCIdcNH/K8IeMDAds88jwfHh4GAiggghBIipcvu+MCIIIQe1eL9rvjAhEHAzwgghBJQTaluuMCIIIQaLVfP7rjAiCCEHtXi/a64wIPCggD2DD4RvLgTPhCbuMA0x/4RFhvdfhk0ds8IY4aI9DTAfpAMDHIz4cgzoIQ+1eL9s8Lgct/yXCOL/hEIG8TIW8S+ElVAm8RyM+EgMoAz4RAzgH6AvQAgGrPQPhEbxXPCx/Lf8n4RG8U4vsA4wDyACEJEAAE+EwCLDD4Qm7jAPhG8nPR+ELy4GT4ANs88gALIAIW7UTQ10nCAY6A4w0MIQJacO1E0PQFcSGAQPQOjoDfciKAQPQPjoDfcPhs+Gv4aoBA9A7yvdcL//hicPhjDg0BAogkAQKJGgN+MPhG8uBM+EJu4wAhk9TR0N7T/9HbPCGOHyPQ0wH6QDAxyM+HIM5xzwthAcjPkyUE2pbOzclw+wCRMOLjAPIAIRQQACjtRNDT/9M/MfhDWMjL/8s/zsntVARQIIIQBm23iLrjAiCCEAs/z1e64wIgghAS2PJMuuMCIIIQSIqXL7rjAh0bFRIDPjD4RvLgTPhCbuMAIZPU0dDe03/T//pA0ds8MNs88gAhEyABWAHbPPhJxwXy4Gn4TFigtX/4bCD6Qm8T1wv/nyDIz4WIzoBvz0DJgED7AN4wFABqyMv/cG2AQPRD+EpxWIBA9Bb4S3JYgED0F8j0AMn4S8jPhID0APQAz4HJ+QDIz4oAQMv/ydADQjD4RvLgTPhCbuMAIZPU0dDe0//Tf9N/03/R2zww2zzyACEWIAP++EL4RSBukjBw3rry4GUiwgDy4GQi+Ey78uBmI/LgZyP4Qr3y4GT4J28QXyKgtX+88uBqIIIImJaAvvLgaPgAVQLIy/9wbYBA9EP4SnFYgED0FvhLcliAQPQXyPQAyfhLyM+EgPQA9ADPgcmJI8IAjoCcIfkAyM+KAEDL/8nQ4hoYFwByMfhMJaG1f/hs+Cj4QlUFVQRVA3/Iz4WAygDPhEDOAfoCcc8LalUgyM+RIipcvst/y//Ozclx+wBbAWJTEfkA+Cj6Qm8SyM+GQMoHy//J0AFTUcjPhYjOAfoCc88LaiHbPMzPkNFqvn/JcfsAGQA00NIAAZPSBDHe0gABk9IBMd70BPQE9ATRXwMAQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABADNjD4RvLgTPhCbuMAIZPU0dDe03/R2zww2zzyACEcIAAk+Er4SccF8uBl+AD4TKC1f/hsAVAw0ds8+EwhjhyNBHAAAAAAAAAAAAAAAAAhm23iIMjOy3/JcPsA3vIAIQAK+Eby4EwCViHWHzH4RvLgTPhCbuMA+AAg0x8yghBIipcvupsg038y+EygtX/4bN4w2zwhIAA0+Ev4SvhD+ELIy//LP8+Dzsz4TMjLf83J7VQAOu1E0NP/0z/TADH6QNTU0dDTf9H4bPhr+Gr4Y/hiAgr0pCD0oSQjABRzb2wgMC41OC4yAAA=
```

Now you can calculate the address of TokenRoot:

```zsh
everdev contract info build/TokenRoot.tvc -d wallet_code:te6ccg......AAA=
```

`-d` is for data.

Deploy the contract:

```zsh
everdev contract deploy build/TokenRoot.tvc -d wallet_code:te6ccg......AAA=
```

First we need to topup the contract:

```zsh
everdev contract topup -a 0:abcabc.... -v 2000000000
```

Once deployed you can check your contract also by specify only the address:

```zsh
everdev contract info -a 0:abcabc....
```

## Interact with the contract

Read and write are done by separate commands. To read the contract you must use `run-local`, the abi file and either:

- the address
- the initial data (it will calculate the address)

```zsh
everdev contract run-local build/TokenRoot.abi.json -a 0:abcabc...

everdev contract run-local build/TokenRoot.abi.json -d wallet_code:te6ccg......AAA=
```

Then you can choose your function, run **only view functions** with run-local.

> You can call the constructor, but this is already called at the deployment, so it will produce an error: `exit code: 51 (Constructor was already called)`

**Write on the contract:**

We use `run` with same arguments as `run-local`:

```zsh
everdev contract run build/TokenRoot.abi.json -a 0:abcabc...

everdev contract run build/TokenRoot.abi.json -d wallet_code:te6ccg......AAA=
```

Try `deployWalletWithBalance`, before you need to topup the contract with `everdev contract topup -a 0:abcabc... -v amount`

**PROBLEM:** The contract state doesn't change when calling this function.
