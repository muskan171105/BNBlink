const express = require('express');
const { getTransactionHistory } = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/authMiddleware'); // Ensure this middleware checks JWT and attaches user info

const router = express.Router();

// Route to get transaction history of a wallet address
router.get('/:address', authenticate, getTransactionHistory);

module.exports = router;
