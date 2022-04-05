pragma ton-solidity ^0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

/**
 * @dev interface of the Root
 **/

interface ITokenRoot {
    function deployEmptyWallet(uint256 _wallet_public_key, uint128 _deploy_evers)
        external
        responsible
        returns (address);

    function mint(address to, uint128 tokens) external;

    function deployWalletWithBalance(
        uint256 _wallet_public_key,
        uint128 _deploy_evers,
        uint128 _tokens
    ) external returns (address);
}
