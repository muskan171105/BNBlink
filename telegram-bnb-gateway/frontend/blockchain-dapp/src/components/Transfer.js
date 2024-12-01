import React, { useState } from 'react';
import Web3 from 'web3';

const Transfer = () => {
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenContractAddress, setTokenContractAddress] = useState('');

  const web3 = new Web3(window.ethereum); // Connect to MetaMask

  const handleTransfer = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0]; // MetaMask's current account

      // Use ERC20 contract if a token address is provided
      let data;
      if (tokenContractAddress) {
        const tokenContract = new web3.eth.Contract(
          [
            {
              constant: false,
              inputs: [
                { name: '_to', type: 'address' },
                { name: '_value', type: 'uint256' }
              ],
              name: 'transfer',
              outputs: [{ name: '', type: 'bool' }],
              type: 'function'
            }
          ],
          tokenContractAddress
        );
        data = tokenContract.methods.transfer(recipientAddress, amount).encodeABI();
      }

      const transaction = {
        to: tokenContractAddress || recipientAddress,
        from: fromAddress,
        value: tokenContractAddress ? '0x0' : web3.utils.toWei(amount, 'ether'),
        gas: 200000, // Adjust gas limit if needed
        data: tokenContractAddress ? data : undefined
      };

      // Sign the transaction using MetaMask
      const signedTransaction = await web3.eth.signTransaction(transaction, fromAddress);

      // Send the signed transaction to the backend
      const response = await fetch('http://localhost:5000/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderAddress, signedTransaction })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Transaction Successful! Hash: ${result.transactionHash}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Transaction failed. Check console for details.');
    }
  };

  return (
    <div>
      <h1>Transfer Funds</h1>
      <input
        type="text"
        placeholder="Sender Wallet Address"
        value={senderAddress}
        onChange={(e) => setSenderAddress(e.target.value)}
        readOnly
      />
      <input
        type="text"
        placeholder="Recipient Wallet Address"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token Contract Address (optional)"
        value={tokenContractAddress}
        onChange={(e) => setTokenContractAddress(e.target.value)}
      />
      <button onClick={handleTransfer}>Send</button>
    </div>
  );
};

export default Transfer;
