const express = require('express');
const dotenv = require('dotenv');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');
const transferRoutes = require('./routes/transfer');
const marketAnalysisRoutes = require('./routes/marketAnalysis'); // Import the market analysis routes
const Alerts = require('./routes/alerts'); // Import the alerts routes
const buySellRoutes = require('./routes/buySell'); // Import buy/sell BNB routes
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { getBalance } = require('./services/bnbchain'); // Import getBalance from bnbchain.js
const { performMarketAnalysis } = require('./services/marketAnalysis'); // Market analysis service
const { handleTransactionHistory } = require('./services/transactionHistory'); // Transaction history service
const { subscribeAlerts, unsubscribeAlerts } = require('./services/alerts'); // Alerts subscription service

// Load environment variables
dotenv.config();

// Validate critical environment variables
if (!process.env.JWT_SECRET || !process.env.RPC_URL) {
  throw new Error(
    'Critical environment variables missing: Ensure JWT_SECRET and RPC_URL are set in your .env file.'
  );
}

// Initialize Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom middleware for logging
app.use(logger);

/**
 * Route to fetch the balance of a wallet address using the bnbchain service.
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

/**
 * Route to handle market analysis request.
 */
app.get('/market/analyze', async (req, res) => {
  try {
    const analysisResult = await performMarketAnalysis();
    res.json(analysisResult);
  } catch (error) {
    console.error('Error performing market analysis:', error.message);
    res.status(500).json({ error: 'Failed to fetch market analysis. Please try again.' });
  }
});

/**
 * Route to handle transaction history request.
 */
app.get('/transactions/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const transactionHistory = await handleTransactionHistory(userId);
    res.json({ transactionHistory });
  } catch (error) {
    console.error(`Error fetching transaction history for user ${userId}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch transaction history. Please try again.' });
  }
});

/**
 * Route to subscribe to alerts (e.g., market price alerts).
 */
app.post('/alerts/subscribe', async (req, res) => {
  const { userId, priceThreshold } = req.body;
  try {
    const result = await subscribeAlerts(userId, priceThreshold);
    res.json({ message: 'Successfully subscribed to alerts.', result });
  } catch (error) {
    console.error('Error subscribing to alerts:', error.message);
    res.status(500).json({ error: 'Failed to subscribe to alerts. Please try again.' });
  }
});

/**
 * Route to unsubscribe from alerts.
 */
app.post('/alerts/unsubscribe', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await unsubscribeAlerts(userId);
    res.json({ message: 'Successfully unsubscribed from alerts.', result });
  } catch (error) {
    console.error('Error unsubscribing from alerts:', error.message);
    res.status(500).json({ error: 'Failed to unsubscribe from alerts. Please try again.' });
  }
});

/**
 * Route to handle buy and sell BNB functionality.
 */
app.use('/buy-sell', buySellRoutes); // Register routes for buying/selling BNB

// Register route modules
app.use('/wallet', walletRoutes); // Routes for wallet-related operations
app.use('/transactions', transactionRoutes); // Routes for transaction-related operations
app.use('/transfer', transferRoutes); // Routes for fund transfer operations
app.use('/market', marketAnalysisRoutes); // Register market analysis routes
app.use('/alerts', Alerts); // Register alerts routes

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found. Please check the endpoint.' });
});

// Global error handling middleware
app.use(errorHandler);

// Export the app instance
module.exports = app;
