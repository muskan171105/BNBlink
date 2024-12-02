const express = require('express');
const dotenv = require('dotenv');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');
const transferRoutes = require('./routes/transfer');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { getBalance } = require('./services/bnbchain'); // Import getBalance from bnbchain.js

dotenv.config();

// Check for critical environment variables
if (!process.env.JWT_SECRET || !process.env.RPC_URL) {
  throw new Error('Critical environment variables missing: Ensure JWT_SECRET and RPC_URL are set in your .env file.');
}

// Initialize Express application
const app = express();
app.use(express.json()); // Enable parsing JSON request bodies
app.use(logger); // Custom middleware for logging

/**
 * Example route to fetch the balance of a wallet address using the bnbchain service.
 */
app.get('/wallet/balance/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (error) {
    console.error(`Error fetching balance for address ${address}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch wallet balance. Please try again.' });
  }
});

// Register route modules
app.use('/wallet', walletRoutes); // Routes for wallet-related operations
app.use('/transactions', transactionRoutes); // Routes for transaction-related operations
app.use('/transfer', transferRoutes); // Routes for fund transfer operations

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found. Please check the endpoint.' });
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
