require("dotenv").config();
const { ethers } = require("ethers");

// Fetch ABI and Contract Address from .env file
const contractABI = JSON.parse(process.env.RELAYER_ABI);  // Parse ABI if it's in JSON format
const contractAddress = process.env.RELAYER_ADDRESS;

// Connect to BSC Testnet via MetaMask (Injected Web3)
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// Example function to interact with the MetaTxRelayer contract
async function executeMetaTransaction() {
  try {
    // Assuming `executeMetaTransaction` is a function in your contract
    const tx = await contract.executeMetaTransaction(
      "0xYourAddressHere",  // example of user address (replace with actual)
      "0xSomeDataHere",     // example of data to pass (depends on your contract)
      { gasLimit: 300000 }
    );
    await tx.wait();  // Wait for the transaction to be mined
    console.log("Meta Transaction executed successfully!");
  } catch (error) {
    console.error("Error executing Meta Transaction:", error);
  }
}

// Call the executeMetaTransaction function
executeMetaTransaction();
