pragma ton-solidity ^0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

library TokenWalletErrors {
    uint8 constant error_tvm_pubkey_not_set = 100;
    uint8 constant error_message_sender_is_not_my_owner = 101;
    uint8 constant error_message_transfer_not_enough_balance = 102;
    uint8 constant error_message_transfer_wrong_recipient = 103;
    uint8 constant error_message_transfer_low_message_value = 104;
    uint8 constant error_message_internal_transfer_bad_sender = 105;
    uint8 constant error_message_transfer_balance_too_low = 106;
}
