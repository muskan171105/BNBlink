require("@nomicfoundation/hardhat-ethers");
require("dotenv").config(); // To use environment variables from .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/", // Testnet RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Use private key from .env file
      timeout:20000,
    },
  },
};

