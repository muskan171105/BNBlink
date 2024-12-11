const web3 = require('../utils/web3Utils');

/**
 * Fetches the transaction history of a wallet address.
 */
const getTransactionHistory = async (req, res) => {
  const { address } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50; // Default limit
  const offset = parseInt(req.query.offset, 10) || 0; // Default offset

  try {
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Restrict access to user's own wallet from OAuth
    if (!req.user || req.user.walletAddress !== address) {
      return res.status(403).json({ error: 'Access denied. Unauthorized wallet address.' });
    }

    const transactions = await fetchBlocksInBatches(address, limit, offset);

    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found for this wallet address.' });
    }

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

  for (let i = startBlock; i <= currentBlock; i += batchSize) {
    blockRanges.push({ start: i, end: Math.min(i + batchSize - 1, currentBlock) });
  }

  for (const range of blockRanges) {
    const blockPromises = [];
    for (let blockNumber = range.start; blockNumber <= range.end; blockNumber++) {
      blockPromises.push(web3.eth.getBlock(blockNumber, true));
    }

    const blocks = await Promise.all(blockPromises);

    blocks.forEach(block => {
      if (block && block.transactions) {
        transactions.push(...filterTransactions(block.transactions, address));
      }
    });

    if (transactions.length >= limit + offset) break;
  }

  return paginate(transactions, offset, limit);
};

/**
 * Filters transactions that match the given address.
 */
const filterTransactions = async (transactions, address) => {
  const filteredTransactions = [];

  for (const tx of transactions) {
    if (tx.from === address || tx.to === address) {
      const timestamp = tx.timestamp || (tx.blockNumber ? (await web3.eth.getBlock(tx.blockNumber)).timestamp : null);
      filteredTransactions.push({
        transactionHash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: web3.utils.fromWei(tx.value, 'ether'),
        timestamp,
        tokenType: tx.input === '0x' ? 'Native' : 'ERC-20',
      });
    }
  }

  return filteredTransactions;
};


/**
 * Paginates the data array based on offset and limit.
 */
const paginate = (data, offset, limit) => data.slice(offset, offset + limit);

module.exports = { getTransactionHistory };
