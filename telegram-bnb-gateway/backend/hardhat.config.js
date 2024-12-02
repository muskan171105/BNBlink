require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To use environment variables from .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    bscTestnet: {
      url: "https://bsc-dataseed.binance.org/", // Updated RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Use private key from .env file
    },
  },
};
