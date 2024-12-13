const Web3 = require('web3');
const { metatxrelayerABI, metatxrelayerAddress } = require('../config');  // Update with your ABI and contract address
const web3 = new Web3(process.env.RPC_URL || 'https://bsc-dataseed.binance.org/');

// Function to handle gasless transfer via metatxrelayer contract
const transferFunds = async (req, res) => { 
  const { from, to, amount, signedMessage, tokenContractAddress } = req.body;

  try {
    // Validate the provided addresses and amount
    if (!web3.utils.isAddress(from) || !web3.utils.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid wallet address.' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer amount.' });
    }

    // Set up the metatxrelayer contract
    const metaTxRelayer = new web3.eth.Contract(metatxrelayerABI, metatxrelayerAddress);

    // Encode the transfer call data (either for BEP-20 or native BNB)
    let transferData;
    if (tokenContractAddress) {
      // BEP-20 Token Transfer
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenContractAddress);
      transferData = tokenContract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).encodeABI();
    } else {
      // Native BNB Transfer
      transferData = web3.eth.abi.encodeFunctionCall({
        name: 'transfer',
        type: 'function',
        inputs: [
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'value' },
        ],
      }, [to, web3.utils.toWei(amount, 'ether')]);
    }

    // Prepare the data for the metatxrelayer to process the relayed transaction
    const gasPrice = await web3.eth.getGasPrice();  // Or use a fixed gas price if necessary
    const relayData = {
      from,  // The sender address
      to: metatxrelayerAddress,  // The relayer contract address
      data: transferData,
      gas: 21000,  // Set appropriate gas limit based on transaction type
      gasPrice: gasPrice,
      nonce: await web3.eth.getTransactionCount(from, 'latest'),
      signedMessage,  // The signed message (relayer will execute on behalf of the user)
    };

    // Send the relay transaction to the metatxrelayer contract
    const signedTx = await web3.eth.accounts.signTransaction(relayData, process.env.RELAYER_PRIVATE_KEY);  // Relayer's private key
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Respond with the transaction receipt
    res.json({
      message: 'Gasless transfer successful',
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
