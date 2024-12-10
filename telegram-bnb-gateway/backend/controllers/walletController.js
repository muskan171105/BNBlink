const web3 = require('../utils/web3Utils');

const createWallet = async (req, res) => {
  try {
    const wallet = web3.eth.accounts.create();
    const { address, privateKey } = wallet;

    // Sending the private key in the response for the user to save securely.
    res.status(201).json({
      message: 'Wallet created successfully',
      address,
      privateKey,
    });
  } catch (error) {
    console.error('Error creating wallet:', error.message);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
};

const getWalletInfo = async (req, res) => {
  try {
    const { address } = req.params;

    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const balance = await web3.eth.getBalance(address);

    res.status(200).json({
      address,
      balance: web3.utils.fromWei(balance, 'ether'),
    });
  } catch (error) {
    console.error('Error fetching wallet info:', error.message);
    res.status(500).json({ error: 'Failed to fetch wallet info' });
  }
};

module.exports = { createWallet, getWalletInfo };
