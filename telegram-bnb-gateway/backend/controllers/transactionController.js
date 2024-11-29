const web3 = require('../utils/web3Utils');

const getTransactionHistory = async (req, res) => {
  const { address } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50;
  const offset = parseInt(req.query.offset, 10) || 0;

  try {
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const transactions = await fetchTransactionHistory(address, limit, offset);
    res.json({ address, transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const fetchTransactionHistory = async (address, limit, offset) => {
  const currentBlock = await web3.eth.getBlockNumber();
  const startBlock = Math.max(0, currentBlock - 1000);

  const transactions = [];
  const blockPromises = [];
  for (let i = startBlock; i <= currentBlock; i++) {
    blockPromises.push(web3.eth.getBlock(i, true));
  }

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

  return transactions.slice(offset, offset + limit);
};

module.exports = { getTransactionHistory };
