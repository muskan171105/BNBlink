// Import Web3 using the correct syntax for the module system you're using
const Web3 = require('web3'); // Ensure Web3 is correctly imported
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

/**
 * Fetches the transaction count (nonce) for a specified wallet address.
 * 
 * @param {string} address - The wallet address for which the transaction count is to be retrieved.
 * @returns {Promise<number>} - The transaction count (nonce).
 * @throws {Error} - Throws an error if the provided address is invalid or the fetch operation fails.
 */
async function getTransactionCount(address) {
  try {
    // Validate the wallet address format
    if (!web3.utils.isAddress(address)) {
      throw new Error('Invalid wallet address.');
    }

    // Fetch the transaction count (nonce) for the specified address
    const transactionCount = await web3.eth.getTransactionCount(address);
    return transactionCount;
  } catch (error) {
    // Log and throw errors with enhanced clarity
    console.error(`Error fetching transaction count for address ${address}: ${error.message}`);
    throw new Error('Failed to fetch the transaction count. Ensure the address is valid.');
  }
}

/**
 * Verifies if a given wallet address exists and has been used for transactions.
 * 
 * @param {string} address - The wallet address to verify.
 * @returns {Promise<boolean>} - True if the address exists, false otherwise.
 * @throws {Error} - Throws an error if the provided address is invalid.
 */
async function verifyAddressExists(address) {
  try {
    // Validate the wallet address format
    if (!web3.utils.isAddress(address)) {
      throw new Error('Invalid wallet address.');
    }

    // Check if the address has a non-zero transaction count
    const transactionCount = await getTransactionCount(address);
    return transactionCount > 0;
  } catch (error) {
    // Log and throw errors with enhanced clarity
    console.error(`Error verifying address existence for ${address}: ${error.message}`);
    throw new Error('Failed to verify the wallet address existence.');
  }
}

// Export all utility functions for use in other parts of the project
module.exports = { getBalance, getTransactionCount, verifyAddressExists };
