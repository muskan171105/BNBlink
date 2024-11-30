import React, { useState } from 'react';

const TransactionForm = ({ onTransfer }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onTransfer({ recipient, amount, tokenAddress });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Token Address (optional)"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <button type="submit">Transfer</button>
    </form>
  );
};

export default TransactionForm;
