const express = require('express');
const { fetchMarketData } = require('../services/marketDataService');

const router = express.Router();

/**
 * Endpoint to fetch market data for a given pair.
 * @route GET /alerts/data/:pair
 */
router.get('/data/:pair', async (req, res) => {
  const { pair } = req.params;
  try {
    const marketData = await fetchMarketData(pair);
    res.status(200).json({ success: true, data: marketData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Endpoint to set alerts for a cryptocurrency pair.
 * @route POST /alerts
 */
router.post('/', async (req, res) => {
  const { pair, priceThreshold, alertType } = req.body;
  if (!pair || !priceThreshold || !alertType) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  // Add logic to store alert details in a database or in-memory store
  // (e.g., save to Redis, Firebase, or a local data structure).

  res.status(201).json({
    success: true,
    message: `Alert for ${pair} has been set at ${priceThreshold} (${alertType}).`,
  });
});

module.exports = router;
