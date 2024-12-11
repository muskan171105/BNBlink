const { ethers } = require("hardhat");

async function main() {
  // Get the account to deploy the contracts
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Log the account balance
  const balance = await deployer.getBalance();
  console.log("Deployer account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy the GaslessTransaction contract
  const GaslessTransaction = await ethers.getContractFactory("GaslessTransaction");
  const gaslessTransaction = await GaslessTransaction.deploy();
  await gaslessTransaction.deployed();
  console.log("GaslessTransaction contract deployed to:", gaslessTransaction.address);

  // Deploy the BNBNFT contract
  const BNBNFT = await ethers.getContractFactory("BNBNFT");
  const bnbNFT = await BNBNFT.deploy();
  await bnbNFT.deployed();
  console.log("BNBNFT contract deployed to:", bnbNFT.address);

  // Mint a test NFT to the deployer to verify the NFT contract
  const mintTx = await bnbNFT.mintNFT(deployer.address);
  await mintTx.wait();
  console.log(`Test NFT minted successfully for: ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
