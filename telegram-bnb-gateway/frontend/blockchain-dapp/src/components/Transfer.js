import React from 'react';
import TransactionForm from './TransactionForm';

const Transfer = ({ onTransfer }) => {
  return (
    <div>
      <h2>Transfer Tokens</h2>
      <TransactionForm onTransfer={onTransfer} />
    </div>
  );
};

export default Transfer;
