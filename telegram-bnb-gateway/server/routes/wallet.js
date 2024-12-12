const express = require('express');
const { createWallet, getWalletInfo, loginWallet } = require('../controllers/walletController');
const { getBalance } = require('../services/bnbchain');

const router = express.Router();

// Route to create a wallet
router.post('/create', async (req, res) => {
  try {
    await createWallet(req, res);
  } catch (error) {
    console.error('Error in /create route:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get wallet info
router.get('/info/:address', async (req, res) => {
  try {
    await getWalletInfo(req, res);
  } catch (error) {
    console.error('Error in /info/:address route:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get wallet balance
router.get('/balance/:address', async (req, res) => {
  try {
    const balance = await getBalance(req, res);
    res.json({ balance });
  } catch (error) {
    console.error('Error in /balance/:address route:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to login with wallet address and passcode
router.post('/login', async (req, res) => {
  try {
    await loginWallet(req, res);
  } catch (error) {
    console.error('Error in /login route:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
