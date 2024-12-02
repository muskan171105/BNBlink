const express = require('express');
const { getTransactionHistory } = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/auth');
const errorHandler = require('../middlewares/errorHandler');
const logger = require('../middlewares/logger');

const router = express.Router();

// Route to fetch transaction history (protected route)
router.get('/:address', authenticate, getTransactionHistory);

// Export the router
module.exports = router;
