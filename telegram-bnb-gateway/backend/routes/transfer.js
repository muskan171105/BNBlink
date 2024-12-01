const { authenticate } = require('../middlewares/auth');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Web3 = require('web3');

const router = express.Router();
const web3 = new Web3(process.env.RPC_URL);

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
      const { signedTransaction } = req.body;

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
