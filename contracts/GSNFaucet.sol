pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract GSNFaucet is Initializable, GSNRecipient {
  uint256 private difficulty;
  uint256 private lastNonce = 0;

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
    bytes32 digest = keccak256(abi.encodePacked(_msgSender(), lastNonce, nonce));
    require(uint256(digest) < getDifficulty(), "Do more work!");
    return true;
  }

  function _preRelayedCall(bytes context) {
    lastNonce = nonce;
  }

  function fooBar(uint256 nonce) public {

  }

  // accept all requests
  function acceptRelayedCall(
    address relay,
    address from,
    bytes calldata encodedFunction,
    uint256 transactionFee,
    uint256 gasPrice,
    uint256 gasLimit,
    uint256 nonce,
    bytes calldata approvalData,
    uint256 maxPossibleCharge
) external view returns (uint256, bytes memory) {
    abi.decode();
    if(this.checkProof()) {
      return _approveRelayedCall(abi.encodePacked());
    } else {

    }
    // lastNonce = nonce;

  }

  function getRecipientBalance() public view returns (uint) {
    return IRelayHub(getHubAddr()).balanceOf(address(this));
  }

}
