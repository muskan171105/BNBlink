import React, { useState } from 'react';
import Wallet from '../components/Wallet'; // Update path as necessary
import fetchBalance from '../utils/fetchBalance'; // Make sure fetchBalance is correctly imported

const App = () => {
  const [balance, setBalance] = useState(null);

  const connectWallet = (privateKey) => {
    console.log('Connected with private key:', privateKey);
    setBalance(0.5); // Dummy balance, replace with actual Web3 logic
  };

  return (
    <div>
      <h1>Blockchain dApp</h1>
      <button onClick={() => connectWallet('your-private-key')}>
        Connect Wallet
      </button>
      <Wallet connectWallet={connectWallet} balance={balance} />
    </div>
  );
};

export default App;
