pragma ton-solidity ^0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "./ITokenWallet.sol";
import "./TokenWalletErrors.sol";

contract TokenWallet is ITokenWallet {
    address static root_address;
    TvmCell static wallet_code;
    uint128 public balance;

    constructor() public {
        //We check that the public key has been established
        require(tvm.pubkey() != 0, TokenWalletErrors.error_tvm_pubkey_not_set);
        tvm.accept();
    }

    modifier onlyRoot() {
        require(root_address == msg.sender, TokenWalletErrors.error_message_sender_is_not_my_owner);
        _;
    }

    modifier onlyOwner() {
        require(tvm.pubkey() == msg.pubkey(), TokenWalletErrors.error_message_sender_is_not_my_owner);
        _;
    }

    function accept(uint128 _tokens) external override onlyRoot {
        // We simply accept any amount of tokens the Root contract wants to send us
        tvm.accept();
        balance += _tokens;
    }

    function getBalance() external view override responsible returns (uint128) {
        // Any contract can get our wallet balance
        return balance;
    }

    function transferToRecipient(
        uint256 _recipient_public_key,
        uint128 _tokens,
        uint128 _deploy_evers,
        uint128 _transfer_evers
    ) external override onlyOwner {
        // With this method we can send tokens to any similar wallet
        // directly. When doing this we can say that we want to first
        // deploy this wallet.

        require(_tokens > 0);
        require(_tokens <= balance, TokenWalletErrors.error_message_transfer_not_enough_balance);
        require(_recipient_public_key != 0, TokenWalletErrors.error_message_transfer_wrong_recipient);
        // You cannot send it to yourself :-)
        require(_recipient_public_key != tvm.pubkey());

        require(
            address(this).balance > _deploy_evers + _transfer_evers,
            TokenWalletErrors.error_message_transfer_balance_too_low
        );

        // A check to make sure we want to add no less than
        // 0.01 ever to the outgoing message. If we don't add enough, the transaction will fail
        // and onBounce won't work.
        // This is an empirical value, as on our network gas does not fluctuate
        // and will only decrease from the original value.
        require(_transfer_evers >= 0.01 ever, TokenWalletErrors.error_message_transfer_low_message_value);

        tvm.accept();

        // We calculate the destination address of the wallet contract.
        TvmCell stateInit = tvm.buildStateInit({
            contr: TokenWallet,
            varInit: {root_address: root_address, wallet_code: wallet_code},
            pubkey: _recipient_public_key,
            code: wallet_code
        });

        address to;
        if (_deploy_evers > 0) {
            // We deploy the wallet, here everything should be familiar.
            to = new TokenWallet{stateInit: stateInit, value: _deploy_evers, wid: address(this).wid, flag: 1}(); // this means that we will pay for the creation of the outgoing message not from с _deploy_evers but from the wallet balance
        } else {
            // We simply determine the destination wallet address.
            to = address(tvm.hash(stateInit));
        }

        balance -= _tokens;

        // Here we send a message with a call to the internalTransfer function,
        // described below. Since we have a guarantee in the blockchain on the order of
        // message delivery, even if we just sent a deploy message
        // for the contract above, we can be sure that it will deploy
        // before the internalTransfer will be called. We also put in
        // bounce: true, in case there is an error (we did not
        // deploy the contract for example) to call the
        // onBounce function and return the money to ourselves.
        ITokenWallet(to).internalTransfer{value: _transfer_evers, flag: 1, bounce: true}(
            _tokens,
            tvm.pubkey(),
            address(this)
        );
    }

    function internalTransfer(
        uint128 _tokens,
        uint256 _sender_public_key,
        address _send_gas_to
    ) external override {
        // Transfer accepting function. This is a very nice concept.
        // We can send tokens directly from one wallet
        // to another because in ES a contract address is a uniquely
        // computed value. We can check that the contract that is
        // calling us is the same kind of contract as ours and has the same
        // Root and code. So we know for sure if the contract calls us
        // these tokens are real and come from the contract root.

        // We determine the address of the contract that called us
        // from _sender_public_key
        address expectedSenderAddress = getExpectedAddress(_sender_public_key);

        // We make sure that the right address called us.
        require(msg.sender == expectedSenderAddress, TokenWalletErrors.error_message_internal_transfer_bad_sender);

        // Accept transfer.
        balance += _tokens;

        if (_send_gas_to.value != 0) {
            // We send all the unspent value that was in the message back
            // to the contract. This is also possible to do via msg.sender,
            // but we want to show you here that you can send
            // in a long chain the address to where the change should be returned
            // if we have a long interaction.
            _send_gas_to.transfer({value: 0, flag: 64});
        }
    }

    function getExpectedAddress(uint256 _wallet_public_key) public view returns (address) {
        TvmCell stateInit = tvm.buildStateInit({
            contr: TokenWallet,
            varInit: {root_address: root_address, wallet_code: wallet_code},
            pubkey: _wallet_public_key,
            code: wallet_code
        });
        return address(tvm.hash(stateInit));
    }

    onBounce(TvmSlice body) external {
        // This is a utility function, messages will only end up here
        // if during message processing, an error occurs
        // but there is enough money to create
        // an onBounce message. No additional checks that you sent the
        // message here are needed, you can't send a message here manually.
        tvm.accept();
        uint32 functionId = body.decode(uint32);
        if (functionId == tvm.functionId(ITokenWallet.internalTransfer)) {
            // Our transfer was not sent, we return the money to our balance.
            uint128 tokens = body.decode(uint128);
            balance += tokens;
        }
    }
}
