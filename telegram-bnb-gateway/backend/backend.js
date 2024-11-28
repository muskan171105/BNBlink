// Import modules and initialize environment
const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');
const Web3 = require('web3');
const { body, validationResult } = require('express-validator');
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
  console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

// Root route
app.get('/', (req, res) => res.send('BNBLink Backend is running'));

// Create a Wallet (Generate new wallet address)
app.post('/wallet/create', async (req, res) => {
  try {
    const wallet = web3.eth.accounts.create();
    const { address, privateKey } = wallet;

    // Securely store the private key on the backend (Never send back)
    // You can choose to store this in an encrypted database or a secure vault
    // For now, we're storing in a mock way. Replace this with actual secure storage.
    // Example: savePrivateKeyToDatabase(address, privateKey);

    res.json({
      message: 'Wallet created successfully',
      address: address,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get Wallet Info (Address, Balance, etc.)
app.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;

    // Check if the address is valid
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Fetch balance from the BNB chain
    const balance = await getBalance(address);

    res.json({
      address: address,
      balance: balance,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Example of a function that would store the private key securely
function savePrivateKeyToDatabase(address, privateKey) {
  // Encrypt the private key before storing in the database
  const encryptedPrivateKey = crypto
    .createCipheriv('aes-256-cbc', Buffer.from(process.env.JWT_SECRET), Buffer.from(process.env.JWT_SECRET))
    .update(privateKey, 'utf-8', 'hex');
  
  // Store in a database securely (this is just a mock function)
  console.log(`Storing private key for address ${address} securely in the database:`, encryptedPrivateKey);
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
