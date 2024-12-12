const axios = require('axios'); // Import axios for making HTTP requests

/**
 * Fetch market data for Binance Coin (BNB) from the CoinGecko API.
 * @returns {Promise<Object>} - BNB market data including price, market cap, volume, etc.
 */
const fetchBNBData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'binancecoin',
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
      }
    );

    // Return the BNB data
    return response.data.binancecoin;
  } catch (error) {
    console.error('Error fetching BNB data from CoinGecko:', error.message);
    throw new Error('Failed to fetch BNB market data.');
  }
};

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

module.exports = { fetchBNBData, analyzeBNBMarket };
