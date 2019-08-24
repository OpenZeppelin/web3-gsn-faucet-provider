pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@0x/contracts-utils/contracts/src/LibBytes.sol";

contract GSNFaucet is Initializable, GSNRecipient {
  using LibBytes for bytes;

  uint256 public constant NOT_ENOUGH_WORK = 1;
  uint256 public constant GRANT = 1e17;

  uint256 private difficulty;
  uint256 private lastNonce = 0;

event Proofed(uint256 digest, uint256 diff);
event Nonced(uint256 nonce);

  function initialize(uint256 _difficulty) public initializer {
    GSNRecipient.initialize();
    difficulty = _difficulty;
  }

  function getLastNonce() public view returns (uint256) {
    return lastNonce;
  }

  function getDifficulty() public view returns (uint256) {
    return difficulty;
  }

  function checkProof(uint256 nonce) public view returns (bool) {
    bytes32 digest = keccak256(abi.encodePacked(_msgSender(), lastNonce, nonce, address(this)));
    // return uint256(digest) < getDifficulty();    
    return true;
  }

  function _preRelayedCall(bytes memory context) internal returns (bytes32) {
    (uint256 proofNonce) = abi.decode(context, (uint256));
    emit Nonced(proofNonce);
    // lastNonce = proofNonce;
    return "";
  }

  function gimme(uint256 nonce) external {
    require(msg.sender == getHubAddr(), "Must be called from RelayHub");
    
    bytes32 digest = keccak256(abi.encodePacked(_msgSender(), lastNonce, nonce, address(this)));
    emit Proofed(uint256(digest), getDifficulty());

    address payable requestor = address(uint160(_msgSender()));
    requestor.transfer(GRANT);
  }

  function acceptRelayedCall(
    address,
    address,
    bytes calldata encodedFunction,
    uint256,
    uint256,
    uint256,
    uint256,
    bytes calldata,
    uint256
  ) external view returns (uint256, bytes memory) {
    uint256 proofNonce = encodedFunction.readUint256(4);
    if (this.checkProof(proofNonce)) {
      return _approveRelayedCall(abi.encodePacked(proofNonce));
    } else {
      return _rejectRelayedCall(NOT_ENOUGH_WORK);
    }
  }

  function getRecipientBalance() public view returns (uint) {
    return IRelayHub(getHubAddr()).balanceOf(address(this));
  }

  function() payable external { }
}
