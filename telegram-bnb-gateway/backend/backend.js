// Import modules and initialize environment
const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Web3 = require('web3');
const jwt = require('jsonwebtoken');
const { getBalance } = require('./bnbchain');

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.JWT_SECRET || !process.env.RPC_URL) {
  throw new Error('Critical environment variables missing.');
}

// Initialize Express app
const app = express();
app.use(express.json());

// Define constants
const PORT = process.env.PORT || 3000;
const web3 = new Web3(process.env.RPC_URL);

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

// Root route
app.get('/', (req, res) => res.send('BNBLink Backend is running'));

// Create a Wallet (Generate new wallet address)
app.post('/wallet/create', async (req, res) => {
  try {
    const wallet = web3.eth.accounts.create();
    const { address, privateKey } = wallet;

    // Securely store the private key
    await savePrivateKeyToDatabase(address, privateKey);

    res.status(201).json({
      message: 'Wallet created successfully',
      address: address,
    });
  } catch (error) {
    console.error('Error creating wallet:', error.message);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Get Wallet Info (Address, Balance, etc.)
app.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Validate wallet address
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Fetch balance from the BNB chain
    const balance = await getBalance(address);

    res.status(200).json({
      address: address,
      balance: balance,
    });
  } catch (error) {
    console.error('Error fetching wallet info:', error.message);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
});

// Transaction History Endpoint
app.get('/transactions/:address', async (req, res) => {
  const { address } = req.params;
  const limit = parseInt(req.query.limit, 10) || 50; // Default limit
  const offset = parseInt(req.query.offset, 10) || 0; // Default offset

  try {
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const currentBlock = await web3.eth.getBlockNumber();
    const startBlock = Math.max(0, currentBlock - 1000); // Fetch transactions from the last 1000 blocks

    const transactions = [];

    // Fetch transactions using Promise.all for better performance
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

    // Apply pagination
    const paginatedTransactions = transactions.slice(offset, offset + limit);
    res.json({ address, transactions: paginatedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Securely store the private key
async function savePrivateKeyToDatabase(address, privateKey) {
  try {
    // Encrypt the private key
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.JWT_SECRET), iv);
    let encryptedPrivateKey = cipher.update(privateKey, 'utf-8', 'hex');
    encryptedPrivateKey += cipher.final('hex');

    // Mock database save (Replace with actual database call)
    console.log(`Saving private key for address ${address}:`, {
      iv: iv.toString('hex'),
      encryptedPrivateKey,
    });

    // In production: save { address, iv, encryptedPrivateKey } in a secure database
  } catch (error) {
    console.error('Error saving private key:', error.message);
    throw new Error('Failed to securely store private key');
  }
}

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
