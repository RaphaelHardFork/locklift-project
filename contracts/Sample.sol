pragma ton-solidity >=0.58.2;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

contract Sample {
    uint16 static _nonce;

    uint256 state;

    event StateChange(uint256 _state);

    constructor(uint256 _state) public {
        tvm.accept();

        setState(_state);
    }

    function setState(uint256 _state) public {
        tvm.accept();
        state = _state;

        emit StateChange(_state);
    }

    function getDetails() external view returns (uint256 _state) {
        return state;
    }

    function viewTvmCell() external pure returns (TvmCell) {
        TvmCell cell;
        return cell;
    }
}
