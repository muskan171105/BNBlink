// Import modules and initialize environment
const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { Biconomy } = require('@biconomy/mexa');
const Web3 = require('web3');
const { getBalance } = require('./bnbchain');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.BICONOMY_API_KEY || !process.env.RPC_URL || !process.env.JWT_SECRET) {
  throw new Error('Critical environment variables missing.');
}

// Initialize Express app
const app = express();
app.use(express.json());

// Define constants
const PORT = process.env.PORT || 3000;
const web3 = new Web3(process.env.RPC_URL);
const biconomy = new Biconomy(web3, { apiKey: process.env.BICONOMY_API_KEY, debug: true });
const biconomyWeb3 = new Web3(biconomy);

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

// Root route
app.get('/', (req, res) => res.send('BNBLink Backend is running'));

// Telegram Authentication
app.post('/auth/telegram', async (req, res) => {
  try {
    // Add authentication logic here
    res.json({ message: 'Telegram Auth logic here' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get Balance Endpoint
app.get('/balance/:address', async (req, res) => {
  try {
    const balance = await getBalance(req.params.address);
    res.json({ balance });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Handle Gasless Transactions
app.post(
  "/sendTransaction",
  [
    body("userAddress").isString().notEmpty(),
    body("functionSignature").isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { userAddress, functionSignature } = req.body;

      // Gasless transaction logic here (Example)
      // biconomyWeb3.eth.sendTransaction({
      //   from: userAddress,
      //   to: '0xReceiverAddress', 
      //   data: functionSignature
      // });

      res.json({ message: 'Transaction processed successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

