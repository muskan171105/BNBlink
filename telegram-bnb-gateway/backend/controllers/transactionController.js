const web3 = require('../utils/web3Utils');

/**
 * Fetches the transaction history of a wallet address.
 */
const getTransactionHistory = async (req, res) => {
  const { address } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50; // Default limit
  const offset = parseInt(req.query.offset, 10) || 0; // Default offset

  try {
    // Validate the wallet address
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Restrict access to user's own wallet from OAuth
    if (!req.user || req.user.walletAddress !== address) {
      return res.status(403).json({ error: 'Access denied. Unauthorized wallet address.' });
    }

    // Fetch transactions using batched block processing
    const transactions = await fetchBlocksInBatches(address, limit, offset);

    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found for this wallet address.' });
    }

    // Respond with transactions and metadata
    res.json({
      address,
      transactions,
      metadata: {
        limit,
        offset,
        total: transactions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history. Please try again.' });
  }
};

/**
 * Fetches blocks in batches and filters transactions for the given address.
 */
const fetchBlocksInBatches = async (address, limit, offset) => {
  const currentBlock = await web3.eth.getBlockNumber();
  const startBlock = Math.max(0, currentBlock - 2000); // Look back over the last 2000 blocks
  const batchSize = 100; // Number of blocks to fetch in each batch

  const transactions = [];
  const blockRanges = [];

  // Split blocks into ranges for batching
  for (let i = startBlock; i <= currentBlock; i += batchSize) {
    blockRanges.push({ start: i, end: Math.min(i + batchSize - 1, currentBlock) });
  }

  // Process each batch of blocks concurrently
  for (const range of blockRanges) {
    const blockPromises = [];
    for (let blockNumber = range.start; blockNumber <= range.end; blockNumber++) {
      blockPromises.push(web3.eth.getBlock(blockNumber, true));
    }

    // Fetch blocks in the current batch
    const blocks = await Promise.all(blockPromises);

    // Extract transactions for the given address
    blocks.forEach(block => {
      if (block && block.transactions) {
        transactions.push(...filterTransactions(block.transactions, address));
      }
    });

    // Stop fetching if we already have enough transactions
    if (transactions.length >= limit + offset) break;
  }

  // Apply pagination to the transactions
  return paginate(transactions, offset, limit);
};

/**
 * Filters transactions that match the given address (either as sender or receiver).
 */
const filterTransactions = (transactions, address) =>
  transactions
    .filter(tx => tx.from === address || tx.to === address)
    .map(tx => ({
      transactionHash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: web3.utils.fromWei(tx.value, 'ether'),
      timestamp: tx.timestamp || null, // Ensure timestamp is included
      tokenType: tx.input === '0x' ? 'Native' : 'ERC-20',
    }));

/**
 * Paginates the data array based on offset and limit.
 */
const paginate = (data, offset, limit) => data.slice(offset, offset + limit);

module.exports = { getTransactionHistory };
