const { analyzeBNBMarket } = require('../services/marketAnalysisService');

/**
 * Controller to fetch BNB market analysis.
 */
const analyzeBNBMarketController = async (req, res) => {
  try {
    const data = await analyzeBNBMarket();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Market analysis for BNB failed:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch BNB market analysis.' });
  }
};

module.exports = { analyzeBNBMarketController };
