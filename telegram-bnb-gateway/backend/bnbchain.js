// Import Web3 using the correct syntax for the module system you're using
const Web3 = require('web3'); // Make sure Web3 is correctly imported
require('dotenv').config(); // Ensure environment variables from .env file are available

// Fetch the Binance Smart Chain RPC URL from the environment variables
const rpcUrl = process.env.RPC_URL;
if (!rpcUrl) {
  throw new Error('RPC_URL is not defined in the environment variables.');
}

// Initialize the Web3 instance with the provided RPC URL
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl)); // Ensure you are using the correct Web3 provider

/**
 * Fetches the BNB balance for a specified wallet address.
 * 
 * @param {string} address - The wallet address for which the balance is to be retrieved.
 * @returns {Promise<string>} - The BNB balance in Ether units (as a string for precision).
 * @throws {Error} - Throws an error if the provided address is invalid or the fetch operation fails.
 */
async function getBalance(address) {
  try {
    // Validate the wallet address format
    if (!web3.utils.isAddress(address)) {
      throw new Error('Invalid wallet address.');
    }

    // Fetch the balance from the blockchain in Wei (the smallest unit of BNB)
    const balanceWei = await web3.eth.getBalance(address);

    // Convert the balance from Wei to Ether (BNB) for readability
    const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
    return balanceEther;
  } catch (error) {
    // Log detailed error information for debugging purposes
    console.error(`Error fetching balance for address ${address}: ${error.message}`);

    // Enhance error messages for user clarity
    if (error.message.includes('Invalid wallet address')) {
      throw new Error('The provided wallet address is invalid. Please check and try again.');
    }
    throw new Error('Failed to fetch the BNB balance. Ensure the address and RPC URL are correct.');
  }
}

// Export the getBalance function for use in other parts of the project
module.exports = { getBalance };
