const express = require('express');
const { createWallet, getWalletInfo } = require('../controllers/walletController');
const {getBalance}=require('../services/bnbchain');
const router = express.Router();

router.post('/create', createWallet);
router.get('/:address', getWalletInfo);
// Example route to get the balance of a wallet address
router.get('/balance/:address', async (req, res) => {
    const address = req.params.address;
  
    try {
      const balance = await getBalance(address);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
