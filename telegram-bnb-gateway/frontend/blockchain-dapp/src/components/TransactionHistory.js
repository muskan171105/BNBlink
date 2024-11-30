import React from 'react';

const TransactionHistory = ({ transactions }) => {
  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            <strong>Hash:</strong> {tx.hash} <br />
            <strong>To:</strong> {tx.to} <br />
            <strong>Amount:</strong> {tx.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
