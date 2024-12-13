// routes/transferTokensRouter.js
const express = require('express');
const router = express.Router();
const Web3 = require('web3');
require('dotenv').config();

// Web3 setup (you can adjust this depending on your network setup)
const web3 = new Web3('https://your-infura-or-other-web3-provider-url');

// Route to fetch contract address and ABI
router.get('/contract-info', (req, res) => {
  try {
    // Fetch contract address and ABI from environment variables
    const contractAddress = process.env.RELAYER_ADDRESS;
    const contractABI = JSON.parse(process.env.RELAYER_ABI);

    // Send the data to the frontend
    res.json({
      address: contractAddress,
      abi: contractABI,
    });
  } catch (error) {
    console.error('Error fetching contract info:', error);
    res.status(500).json({ error: 'Failed to fetch contract info' });
  }
});

// Route to handle token transfer
router.post('/transfer', async (req, res) => {
  const { toAddress, amount, fromAddress, privateKey } = req.body;

  // Check if all required fields are provided
  if (!toAddress || !amount || !fromAddress || !privateKey) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Fetch contract address and ABI from environment variables
    const contractAddress = process.env.RELAYER_ADDRESS;
    const contractABI = JSON.parse(process.env.RELAYER_ABI);

    // Set up the contract using Web3
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Create the transaction object
    const transaction = contract.methods.transfer(toAddress, web3.utils.toWei(amount, 'ether')); // Assuming transfer is in ETH, you can adjust for your token type

    // Estimate gas for the transaction
    const gas = await transaction.estimateGas({ from: fromAddress });
    const gasPrice = await web3.eth.getGasPrice();

    // Sign the transaction using the private key
    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: transaction.encodeABI(),
        gas,
        gasPrice,
      },
      privateKey
    );

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    // Return success response
    res.status(200).json({
      message: `Successfully transferred ${amount} tokens to ${toAddress}`,
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error during token transfer:', error);
    res.status(500).json({ error: 'Internal server error during token transfer' });
  }
});

module.exports = router;
