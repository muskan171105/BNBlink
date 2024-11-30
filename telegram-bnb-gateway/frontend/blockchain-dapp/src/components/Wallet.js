import React, { useState } from 'react';

const Wallet = ({ connectWallet, balance }) => {
  const [privateKey, setPrivateKey] = useState('');

  const handleConnect = () => {
    connectWallet(privateKey);
  };

  return (
    <div>
      <h2>Wallet</h2>
      <input
        type="text"
        placeholder="Enter Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      <button onClick={handleConnect}>Connect Wallet</button>
      {balance && <p>Balance: {balance} ETH</p>}
    </div>
  );
};

export default Wallet;
