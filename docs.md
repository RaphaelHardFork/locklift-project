Requirement:

- everdev cli
- local network (se) with docker
- follow the quick start quide to configure the network, signers and givers

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
