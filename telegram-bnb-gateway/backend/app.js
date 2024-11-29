const express = require('express');
const dotenv = require('dotenv');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');
const transferRoutes = require('./routes/transferAPI');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { getBalance } = require('./services/bnbchain'); // Import getBalance from bnbchain.js

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.RPC_URL) {
  throw new Error('Critical environment variables missing.');
}

const app = express();
app.use(express.json());
app.use(logger);

// Example route to use getBalance from bnbchain.js
app.get('/wallet/balance/:address', async (req, res) => {
  const { address } = req.params;
  
  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/wallet', walletRoutes);
app.use('/transactions', transactionRoutes);
app.use('/transfer', transferRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
