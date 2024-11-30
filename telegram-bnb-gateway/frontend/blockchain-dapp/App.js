import React, { useState } from 'react';
import Header from './components/Header';
import Wallet from './components/Wallet';
import Transfer from './components/Transfer';
import TransactionHistory from './components/TransactionHistory';

const App = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const connectWallet = (privateKey) => {
    // Fetch wallet balance here using web3
    console.log('Connected with private key:', privateKey);
    setBalance('0.5'); // Dummy value, replace with actual balance
  };

  const handleTransfer = (transactionData) => {
    console.log('Transfer initiated:', transactionData);
    // Add transaction logic here
  };

  return (
    <div>
      <Header />
      <Wallet connectWallet={connectWallet} balance={balance} />
      <Transfer onTransfer={handleTransfer} />
      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default App;
