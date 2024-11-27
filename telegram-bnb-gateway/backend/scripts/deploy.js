const { ethers } = require("hardhat");

async function main() {
    const MetaTxRelayer = await ethers.getContractFactory("GaslessTransaction");
    console.log("Deploying MetaTxRelayer...");
    const metaTxRelayer = await MetaTxRelayer.deploy();

    await metaTxRelayer.deployed();
    console.log("MetaTxRelayer deployed to:", metaTxRelayer.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
