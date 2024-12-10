const express = require('express');
const { getTransactionHistory } = require('../controllers/transactionController');

const router = express.Router();

// Route to get transaction history of a wallet address
router.get('/:address', getTransactionHistory);

module.exports = router;
