const express = require('express');
const { fetchBNBData } = require('../services/marketDataService');

const router = express.Router();

/**
 * Endpoint to fetch market data for Binance Coin (BNB).
 * @route GET /alerts/data/bnb
 */
router.get('/data/bnb', async (req, res) => {
  try {
    const marketData = await fetchBNBData(); // Call the BNB-specific function
    res.status(200).json({ success: true, data: marketData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Endpoint to set alerts for a cryptocurrency pair (BNB only for now).
 * @route POST /alerts
 */
router.post('/', async (req, res) => {
  const { priceThreshold, alertType } = req.body;
  if (!priceThreshold || !alertType) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  // Logic for setting alerts (e.g., saving them to a database or cache)

  res.status(201).json({
    success: true,
    message: `Alert for BNB has been set at ${priceThreshold} (${alertType}).`,
  });
});

module.exports = router;
