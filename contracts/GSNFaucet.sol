pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract GSNFaucet is Initializable, GSNRecipient {

  function initialize() public initializer {
    GSNRecipient.initialize();
  }

  // accept all requests
  function acceptRelayedCall(
    address,
    address,
    bytes calldata,
    uint256,
    uint256,
    uint256,
    uint256,
    bytes calldata,
    uint256
    ) external view returns (uint256, bytes memory) {
    return _approveRelayedCall();
  }

  function getRecipientBalance() public view returns (uint) {
    return IRelayHub(getHubAddr()).balanceOf(address(this));
  }

}
