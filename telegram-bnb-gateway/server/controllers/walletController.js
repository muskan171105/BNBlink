const bcrypt = require('bcrypt');
const crypto = require('crypto');
const web3 = require('../utils/web3Utils');

// In-memory wallet storage (replace with database in production)
let wallets = [];

/**
 * Create a new wallet.
 */
const createWallet = async (req, res) => {
  try {
    // Generate a random wallet address (this would normally be a more complex address generation mechanism)
    const wallet = web3.eth.accounts.create();
    const { address, privateKey } = wallet;

    // Generate a random passcode
    const passcode = crypto.randomBytes(8).toString('hex');

    // Hash the passcode
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    // Store wallet details and the hashed passcode
    wallets.push({ address, privateKey, passcode: hashedPasscode });

    // Send the wallet address and passcode to the user (passcode should be saved securely)
    res.status(201).json({
      message: 'Wallet created successfully',
      address,
      passcode, // send passcode here for user to save securely
    });
  } catch (error) {
    console.error('Error creating wallet:', error.message);
    res.status(500).json({ error: 'Failed to create wallet' });
  }
};

/**
 * Get wallet information (like balance).
 */
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

/**
 * Login with wallet address and passcode.
 */
const loginWallet = async (req, res) => {
  try {
    const { address, passcode } = req.body;

    if (!address || !passcode) {
      return res.status(400).json({ error: 'Wallet address and passcode are required.' });
    }

    // Find the wallet by address
    const wallet = wallets.find(w => w.address === address);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet address not found.' });
    }

    // Compare the passcode with the stored hash
    const isValidPasscode = await bcrypt.compare(passcode, wallet.passcode);
    if (!isValidPasscode) {
      return res.status(401).json({ error: 'Invalid passcode.' });
    }

    // If valid, send success message (JWT can be added here)
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createWallet, getWalletInfo, loginWallet };
