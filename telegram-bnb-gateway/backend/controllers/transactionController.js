const web3 = require('../utils/web3Utils');

/**
 * Controller to fetch the transaction history of a wallet address.
 * @param {Object} req - Express request object containing parameters and query.
 * @param {Object} res - Express response object to send the response.
 */
const getTransactionHistory = async (req, res) => {
  const { address } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50; // Default to 50 transactions
  const offset = parseInt(req.query.offset, 10) || 0; // Default offset is 0

  try {
    // Validate wallet address
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Fetch the transaction history
    const transactions = await fetchTransactionHistory(address, limit, offset);

    // Return the response
    res.json({ address, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: 'Failed to fetch transaction history. Please try again.' });
  }
};

/**
 * Utility function to fetch the transaction history for a wallet.
 * Optimized for pagination.
 * @param {string} address - Wallet address to fetch transactions for.
 * @param {number} limit - Maximum number of transactions to return.
 * @param {number} offset - Number of transactions to skip.
 * @returns {Promise<Array>} - Array of transaction objects.
 */
const fetchTransactionHistory = async (address, limit, offset) => {
  const currentBlock = await web3.eth.getBlockNumber();
  const startBlock = Math.max(0, currentBlock - 2000); // Look back over 2000 blocks (adjustable)

  const transactions = [];
  const blockPromises = [];
  for (let i = startBlock; i <= currentBlock; i++) {
    blockPromises.push(web3.eth.getBlock(i, true));
  }

  // Process blocks concurrently for efficiency
  const blocks = await Promise.all(blockPromises);

  blocks.forEach(block => {
    if (block && block.transactions) {
      block.transactions.forEach(tx => {
        if (tx.from === address || tx.to === address) {
          transactions.push({
            transactionHash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: web3.utils.fromWei(tx.value, 'ether'),
            timestamp: block.timestamp,
            tokenType: tx.input === '0x' ? 'BNB' : 'ERC-20',
          });
        }
      });
    }
  });

  // Apply pagination to the results
  return transactions.slice(offset, offset + limit);
};

module.exports = { getTransactionHistory, fetchTransactionHistory };
