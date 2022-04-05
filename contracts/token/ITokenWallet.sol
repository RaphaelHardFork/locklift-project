pragma ton-solidity ^0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

interface ITokenWallet {
    function getBalance() external view responsible returns (uint128);

    function accept(uint128 _tokens) external;

    function transferToRecipient(
        uint256 _recipient_public_key,
        uint128 _tokens,
        uint128 _deploy_evers,
        uint128 _transfer_evers
    ) external;

    function internalTransfer(
        uint128 _tokens,
        uint256 _sender_public_key,
        address _send_gas_to
    ) external;
}
