const web3 = require('../utils/web3Utils');
const { savePrivateKeyToDatabase } = require('../utils/encryption');

const createWallet = async (req, res) => {
  try {
    const wallet = web3.eth.accounts.create();
    const { address, privateKey } = wallet;

    await savePrivateKeyToDatabase(address, privateKey);

    res.status(201).json({
      message: 'Wallet created successfully',
      address,
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
