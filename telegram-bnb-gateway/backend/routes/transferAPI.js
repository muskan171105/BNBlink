const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate } = require('../middlewares/auth');
const Web3 = require('web3');

const router = express.Router(); // Use a router instead of app
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Replace with your Web3 provider

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
  [
    body('senderPrivateKey').isString().notEmpty(),
    body('recipientAddress').isString().notEmpty(),
    body('amount').isString().notEmpty(),
    body('tokenContractAddress').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { senderPrivateKey, recipientAddress, amount, tokenContractAddress } = req.body;

      // Initialize wallet and account
      const senderAccount = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
      web3.eth.accounts.wallet.add(senderAccount);

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
          value: amount, // Amount in wei
          gas: 21000 // Standard gas limit for native token transfers
        };
      }

      // Sign and send the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, senderPrivateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      res.json({
        message: 'Transaction successful',
        transactionHash: receipt.transactionHash
      });
    } catch (error) {
      console.error('Error while processing transaction:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router; // Export the router
