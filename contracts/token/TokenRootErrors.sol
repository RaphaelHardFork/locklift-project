pragma ton-solidity ^0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

library TokenRootErrors {
    uint8 constant error_tvm_pubkey_not_set = 100;
    uint8 constant error_message_sender_is_not_my_owner = 101;
    uint8 constant error_deploy_ever_to_small = 102;
    uint8 constant error_insufficient_evers_on_contract_balance = 103;
    uint8 constant error_deploy_wallet_pubkey_not_set = 104;
}
