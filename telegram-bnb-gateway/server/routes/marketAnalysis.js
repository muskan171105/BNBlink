const express = require('express');
const { analyzeBNBMarketController } = require('../controllers/marketAnalysisController');

const router = express.Router();

/**
 * Route to fetch market analysis for Binance Coin (BNB).
 */
router.get('/bnb', analyzeBNBMarketController);

module.exports = router;
