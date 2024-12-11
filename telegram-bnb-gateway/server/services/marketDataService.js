const axios = require('axios');

/**
 * Fetch real-time market data for Binance Coin (BNB).
 * @returns {Promise<Object>} - The market data for Binance Coin (BNB).
 */
const fetchBNBData = async () => {
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true';
    const response = await axios.get(url);
    return response.data.binancecoin; // Return the data for BNB only
  } catch (error) {
    console.error('Error fetching BNB market data:', error.message);
    throw new Error('Failed to fetch BNB market data.');
  }
};

module.exports = { fetchBNBData };
