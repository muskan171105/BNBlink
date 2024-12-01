// src/components/Home.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const Home = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const web3 = new Web3(window.ethereum);

  // Connect to wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  // Get wallet balance
  const getBalance = async (address) => {
    try {
      const balance = await web3.eth.getBalance(address);
      setBalance(web3.utils.fromWei(balance, 'ether')); // Convert balance from Wei to Ether
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Send transaction
  const sendTransaction = async () => {
    if (!recipient || !amount) {
      alert("Please provide recipient address and amount.");
      return;
    }
    
    try {
      const tx = await web3.eth.sendTransaction({
        from: account,
        to: recipient,
        value: web3.utils.toWei(amount, 'ether'),
      });
      setTransactionStatus(`Transaction successful! Hash: ${tx.transactionHash}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      setTransactionStatus("Transaction failed. Please try again.");
    }
  };

  useEffect(() => {
    if (account) {
      getBalance(account);
    }
  }, [account]);

  return (
    <div className="home">
      <h1>BNBLink - Blockchain Wallet</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <h2>Connected Account: {account}</h2>
          <h3>Balance: {balance} BNB</h3>
          
          <div>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount in BNB"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={sendTransaction}>Send BNB</button>
          </div>
          
          {transactionStatus && <p>{transactionStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default Home;
