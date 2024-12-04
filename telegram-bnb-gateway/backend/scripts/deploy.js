const { ethers } = require("hardhat");

async function main() {
  // Get the account to deploy the contract
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the ContractFactory for the compiled GaslessTransaction contract
  const GaslessTransaction = await ethers.getContractFactory("GaslessTransaction");

  // Deploy the contract
  const gaslessTransaction = await GaslessTransaction.deploy();
  console.log("GaslessTransaction contract deployed to:", gaslessTransaction.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });