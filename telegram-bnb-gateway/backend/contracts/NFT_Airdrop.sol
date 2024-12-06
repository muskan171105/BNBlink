// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "Contracts_v2/security/Pausable.sol";
import "Contracts_v2/utils/cryptography/MerkleProof.sol";
import "Contracts_v2/Accel/NFT_Airdrop/token/IERC721AMintable.sol";
contract NFT_Airdrop is Pausable {

  event UpdateNFTCollectionAddressNA(address indexed nftCollection);
  event SetRootNA(bytes32 indexed root);
  event ClaimNA(address indexed owner, uint256 quantity);
  event OwnershipGranted(address indexed grantedOwner);
  event OwnershipTransferredNFTAirdrop(address indexed previousOwner, address indexed newOwner);
  event SetClaimedAmountNA(address[] indexed accounts, uint256[] claimedAmounts);
  address public NFTCollection0;
  bytes32 public root0;
  address private _grantedOwner0;
  address private _owner0;
  mapping(address=>uint256) public claimedAmount0;
  constructor ()
  {

  }
  modifier onlyOwnerNFTAirdrop0 ()   {
    require ((msg.sender == ownerNA()),"Ownable: caller is not the owner");
    _;
  }
  

  function updateNFTCollectionAddressNA(address _nftCollection) external onlyOwnerNFTAirdrop0()
  {
    NFTCollection0 = _nftCollection;
    emit UpdateNFTCollectionAddressNA(_nftCollection);
  }
  

  function pauseNA() external onlyOwnerNFTAirdrop0()
  {
    _pause();
  }
  

  function unpauseNA() external onlyOwnerNFTAirdrop0()
  {
    _unpause();
  }
  

  function setRootNA(bytes32 _root) external onlyOwnerNFTAirdrop0()
  {
    root0 = _root;
    emit SetRootNA(_root);
  }
  

  function claim(uint256 quantity, uint256 claimableTotal, bytes32[] memory proof) external whenNotPaused()
  {
    require ((claimedAmount0[(msg.sender)] + quantity <= claimableTotal),"NFT-Airdrop::Exceed the maximum amount");
    require ((_verifyAirdropNA(msg.sender, claimableTotal, proof)),"NFT-Airdrop::Account not in airdrop");
    IERC721AMintable TokenCollection = IERC721AMintable(NFTCollection0);
    TokenCollection.mint(msg.sender, quantity);
    claimedAmount0[(msg.sender)] += quantity;
    emit ClaimNA(msg.sender, quantity);
  }
  

  function _verifyAirdropNA(address recipient, uint256 amount, bytes32[] memory proof) internal view returns (bool )
  {
    bytes32 leaf = keccak256(abi.encodePacked(recipient, amount));
    return MerkleProof.verify(proof, root0, leaf);
  }
  

  function grantOwnershipNA(address newOwner) external virtual onlyOwnerNFTAirdrop0()
  {
    emit OwnershipGranted(newOwner);
    _grantedOwner0 = newOwner;
  }
  

  function claimOwnershipNA() external virtual
  {
    require ((_grantedOwner0 == msg.sender),"Ownable: caller is not the granted owner");
    emit OwnershipTransferredNFTAirdrop(_owner0, _grantedOwner0);
    _owner0 = _grantedOwner0;
    _grantedOwner0 = address(0);
  }
  

  function setClaimedAmountNA(address[] memory accounts, uint256[] memory claimedAmounts) external virtual onlyOwnerNFTAirdrop0()
  {
    require ((accounts.length == claimedAmounts.length),"NFT-Airdrop::Invalid array length");
    for (uint256 i = 0; i < accounts.length; i++)
    {
      claimedAmount0[(accounts[i])] = claimedAmounts[i];
    }
    emit SetClaimedAmountNA(accounts, claimedAmounts);
  }
  

  function ownerNA() public virtual view returns (address )
  {
    return _owner0;
  }
  

}
