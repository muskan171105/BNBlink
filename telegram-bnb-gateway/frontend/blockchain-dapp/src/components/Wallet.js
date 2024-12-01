import React, { useState } from 'react';
import fetchBalance from '../utils/fetchBalance'; // Import the balance-fetching function

const Wallet = ({ connectWallet, balance }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [localBalance, setLocalBalance] = useState(balance);

  // Function to fetch the balance when the user provides the wallet address
  const fetchWalletBalance = async () => {
    if (!walletAddress) {
      alert('Please enter a wallet address');
      return;
    }

    try {
      // Fetch balance from fetchBalance function
      const result = await fetchBalance(walletAddress, tokenAddress);
      setLocalBalance(result); // Set the fetched balance
    } catch (error) {
      console.error('Error fetching balance:', error.message);
    }
  };

  return (
    <div>
      <h1>Wallet Balance</h1>
      
      {/* Input for wallet address */}
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      
      {/* Input for token address (optional) */}
      <input
        type="text"
        placeholder="Enter Token Address (Optional)"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      
      {/* Button to trigger balance fetching */}
      <button onClick={fetchWalletBalance}>Get Balance</button>
      
      {/* Display the balance */}
      {localBalance && (
        <p>
          Balance: {localBalance} {tokenAddress ? 'Token' : 'BNB'}
        </p>
      )}
      
      {/* Existing balance from parent component */}
      {balance && <p>Connected Wallet Balance: {balance} BNB</p>}
    </div>
  );
};

export default Wallet;
