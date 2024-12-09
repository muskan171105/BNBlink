const Web3 = require('web3');

// Ensure the RPC URL is available
const rpcUrl = process.env.RPC_URL || 'https://bsc-dataseed.binance.org/';

if (!rpcUrl) {
  throw new Error('RPC_URL is not defined in the environment variables');
}

// Initialize Web3 with the RPC URL
const web3 = new Web3(rpcUrl);

console.log(`Connected to BNB Chain via ${rpcUrl}`);

module.exports = web3;
