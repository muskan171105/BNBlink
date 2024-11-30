const express = require('express');
const { getTransactionHistory } = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Route to fetch transaction history (protected route)
router.get('/:address', authenticate, getTransactionHistory);

module.exports = router;
