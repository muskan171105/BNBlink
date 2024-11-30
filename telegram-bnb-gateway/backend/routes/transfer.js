const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middlewares/auth');
const Web3 = require('web3');

const router = express.Router(); // Initialize router
require('dotenv').config(); // Ensure environment variables are loaded

const web3 = new Web3(process.env.RPC_URL); // Use RPC URL from environment variables

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

// Token Transfer API
router.post(
  '/transfer',
  authenticate, // Protect the route with authentication middleware
  [
    body('senderPrivateKey').isString().notEmpty().withMessage('Sender private key is required.'),
    body('recipientAddress').isString().notEmpty().withMessage('Recipient address is required.'),
    body('amount').isString().notEmpty().withMessage('Amount is required.'),
    body('tokenContractAddress').optional().isString().withMessage('Invalid token contract address.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { senderPrivateKey, recipientAddress, amount, tokenContractAddress } = req.body;

      // Validate recipient address format
      if (!web3.utils.isAddress(recipientAddress)) {
        return res.status(400).json({ error: 'Invalid recipient address.' });
      }

      // Initialize wallet and account
      const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
      web3.eth.accounts.wallet.add(senderAccount);

      // Determine the transaction type (native or ERC-20 token transfer)
      let tx;
      if (tokenContractAddress) {
        // ERC-20 Token Transfer Logic
        const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenContractAddress);
        const data = tokenContract.methods.transfer(recipientAddress, amount).encodeABI();

        tx = {
          from: senderAccount.address,
          to: tokenContractAddress,
          gas: 100000, // Adjust gas limit as needed
          data
        };
      } else {
        // Native Token Transfer Logic
        tx = {
          from: senderAccount.address,
          to: recipientAddress,
          value: web3.utils.toWei(amount, 'ether'), // Convert amount to wei
          gas: 21000 // Standard gas limit for native token transfers
        };
      }

      // Sign and send the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      // Respond with transaction details
      res.json({
        message: 'Transaction successful',
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed
      });
    } catch (error) {
      console.error('Error while processing transaction:', error.message);

      // Enhanced error response for clarity
      res.status(500).json({
        error: error.message,
        suggestion: 'Please verify the provided addresses, private key, and RPC URL.'
      });
    }
  }
);

module.exports = router; // Export the router
