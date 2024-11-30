const web3 = require('../utils/web3Utils');

/**
 * Controller to handle fund transfers between wallet addresses.
 * @param {Object} req - Express request object containing transfer details.
 * @param {Object} res - Express response object for sending the transfer status.
 */
const transferFunds = async (req, res) => {
  const { from, to, amount, privateKey } = req.body;

  try {
    // Validate the provided addresses and amount
    if (!web3.utils.isAddress(from) || !web3.utils.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid wallet address.' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer amount.' });
    }

    // Convert the transfer amount to Wei
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

    // Build the transaction object
    const txObject = {
      from,
      to,
      value: amountInWei,
      gas: 21000, // Set the gas limit for a simple transfer
    };

    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    // Send the transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Respond with the transaction receipt
    res.json({
      message: 'Transfer successful',
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    });
  } catch (error) {
    console.error('Error during transfer:', error.message);
    res.status(500).json({ error: 'Transfer failed. Please try again.' });
  }
};

module.exports = { transferFunds };
