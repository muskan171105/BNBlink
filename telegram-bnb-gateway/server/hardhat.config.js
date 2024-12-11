require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To use environment variables from .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    bscTestnet: {
      url: "https://opbnb-testnet-rpc.bnbchain.org", // Testnet RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Use private key from .env file
    },
  },
};

