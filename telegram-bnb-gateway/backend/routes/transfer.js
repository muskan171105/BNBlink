const express = require('express');
const { body, validationResult } = require('express-validator');
const Web3 = require('web3');

const router = express.Router();

// Use BNB-compatible RPC URL
const web3 = new Web3(process.env.RPC_URL || 'https://bsc-dataseed.binance.org/');

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
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  }
];

// Token Transfer API for BNB Chain
router.post(
  '/transfer',
  [
    body('senderAddress').isString().notEmpty(),
    body('recipientAddress').isString().notEmpty(),
    body('amount').isString().notEmpty(),
    body('tokenContractAddress').optional().isString(),
    body('signedTransaction').isString().notEmpty() // Signed transaction from the frontend
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { senderAddress, amount, tokenContractAddress, signedTransaction } = req.body;
      const transferAmount = web3.utils.toBN(amount);

      // If a token contract address is provided, check the BEP-20 balance
      if (tokenContractAddress) {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenContractAddress);
        const balance = await tokenContract.methods.balanceOf(senderAddress).call();

        if (web3.utils.toBN(balance).lt(transferAmount)) {
          return res.status(400).json({
            error: 'Insufficient token balance'
          });
        }
      } else {
        // For BNB transfer, check the BNB balance
        const balance = await web3.eth.getBalance(senderAddress);

        if (web3.utils.toBN(balance).lt(transferAmount)) {
          return res.status(400).json({
            error: 'Insufficient BNB balance'
          });
        }
      }

      // Broadcast the signed transaction
      const receipt = await web3.eth.sendSignedTransaction(signedTransaction);

      res.json({
        message: 'Transaction successful',
        transactionHash: receipt.transactionHash
      });
    } catch (error) {
      console.error('Error processing transaction:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
