const express = require('express');
const cors = require('cors');  // Import CORS package
const dotenv = require('dotenv');
const walletRoutes = require('./routes/wallet');
const transactionRoutes = require('./routes/transaction');
const transferRoutes = require('./routes/transfer');
const marketAnalysisRoutes = require('./routes/marketAnalysis'); // Market analysis routes
const alertsRoutes = require('./routes/alerts'); // Alerts routes
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { getBalance } = require('./services/bnbchain'); // Get balance service
const { performMarketAnalysis } = require('./routes/marketAnalysis'); // Market analysis service
const { getTransactionHistory } = require('./routes/transaction'); // Transaction history service
const { subscribeAlerts, unsubscribeAlerts } = require('./routes/alerts'); // Alerts subscription services
const { authenticate } = require('./authentication'); // Authentication middleware
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io'); // Import socket.io for real-time communication
const { analyzeBNBMarket } = require('./services/marketAnalysisService');

// Load environment variables
dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Should print your JWT secret
console.log('RPC_URL:', process.env.RPC_URL);       // Should print the RPC URL
console.log('WALLET_ADDRESS:', process.env.WALLET_ADDRESS); // Should print the wallet address


// Validate critical environment variables
if (!process.env.JWT_SECRET || !process.env.RPC_URL || !process.env.WALLET_ADDRESS) {
  throw new Error(
    'Critical environment variables missing: Ensure JWT_SECRET, RPC_URL, and WALLET_ADDRESS are set in your .env file.'
  );
}

// Initialize Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Custom middleware for logging
app.use(logger);

// Enable CORS for all routes
app.use(cors());

/**
 * Apply authentication middleware globally
 * Ensure authentication is applied only to routes requiring it
 */
app.use('/transaction', authenticate); // Apply to transaction routes
app.use('/transfer', authenticate); // Apply to transfer routes
app.use('/alerts', authenticate); // Apply to alerts routes

/**
 * Route to fetch the balance of a wallet address using the wallet route.
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
 * Route to fetch transaction history of a wallet.
 */
app.get('/transactions/:address', async (req, res) => {
  const { address } = req.params;
  const { limit, offset } = req.query;

  try {
    const transactionHistory = await getTransactionHistory(address, {
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
    });
    res.json(transactionHistory);
  } catch (error) {
    console.error(`Error fetching transaction history for address ${address}:`, error.message);
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

// Route to handle token transfer
app.post('/transfer', async (req, res) => {
  const { toAddress, amount, fromAddress, privateKey } = req.body;

  // Check if all required fields are provided
  if (!toAddress || !amount || !fromAddress || !privateKey) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Fetch contract address and ABI from environment variables
    const contractAddress = process.env.RELAYER_ADDRESS;
    const contractABI = JSON.parse(process.env.RELAYER_ABI);

    // Set up Web3 and contract instance
    const Web3 = require('web3');
    const web3 = new Web3(process.env.RPC_URL);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Create the transaction object
    const transaction = contract.methods.transfer(toAddress, web3.utils.toWei(amount, 'ether')); // Adjust 'ether' if using another token

    // Estimate gas for the transaction
    const gas = await transaction.estimateGas({ from: fromAddress });
    const gasPrice = await web3.eth.getGasPrice();

    // Sign the transaction using the private key
    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: transaction.encodeABI(),
        gas,
        gasPrice,
      },
      privateKey
    );

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    // Return success response
    res.status(200).json({
      message: `Successfully transferred ${amount} tokens to ${toAddress}`,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error during token transfer:', error);
    res.status(500).json({ error: 'Internal server error during token transfer' });
  }
});

// Example login route to generate a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Replace with your actual user authentication logic
  if (username === 'testuser' && password === 'password123') {
    const payload = {
      username,
      walletAddress: process.env.WALLET_ADDRESS, // Use wallet address from the .env file
    };

    // Generate a token (use a strong secret from your .env file)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Register route modules
app.use('/wallet', walletRoutes); // Routes for wallet-related operations
app.use('/transaction', transactionRoutes); // Routes for transaction-related operations
app.use('/transfer', transferRoutes); // Routes for fund transfer operations
app.use('/market', marketAnalysisRoutes); // Register market analysis routes
app.use('/alerts', alertsRoutes); // Register alerts routes

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found. Please check the endpoint.' });
});

// Global error handling middleware
app.use(errorHandler);

// Export the app instance
module.exports = app;
