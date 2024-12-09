const express = require('express');
const { createWallet, getWalletInfo } = require('../controllers/walletController');
const { getBalance } = require('../services/bnbchain');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to create a wallet (protected route with authentication)
router.post('/create', authenticate, createWallet);

// Route to get wallet information (protected route with authentication)
router.get('/:address', authenticate, getWalletInfo);

// Route to get the balance of a wallet address (protected route with authentication)
router.get('/balance/:address', authenticate, async (req, res) => {
  const address = req.params.address;

  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
