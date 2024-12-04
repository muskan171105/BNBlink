const { fetchBNBData } = require('./marketDataService');

/**
 * Perform market analysis for Binance Coin (BNB).
 * @returns {Promise<Object>} - BNB market data and insights.
 */
const analyzeBNBMarket = async () => {
  try {
    const bnbData = await fetchBNBData();

    // Example Analysis
    const analysis = {
      price: bnbData.usd, // Current price in USD
      marketCap: bnbData.usd_market_cap, // Market cap in USD
      volume: bnbData.usd_24h_vol, // 24-hour trading volume in USD
      change24h: bnbData.usd_24h_change, // 24-hour price change percentage
    };

    return analysis;
  } catch (error) {
    console.error('Error analyzing BNB market:', error.message);
    throw new Error('Failed to analyze BNB market.');
  }
};

module.exports = { analyzeBNBMarket };
