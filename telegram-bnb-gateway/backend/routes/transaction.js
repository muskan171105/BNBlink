const express = require('express');
const { getTransactionHistory } = require('../controllers/transactionController');
const router = express.Router();

router.get('/:address', getTransactionHistory);

module.exports = router;
