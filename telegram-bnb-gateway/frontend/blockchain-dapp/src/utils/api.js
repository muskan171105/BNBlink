export const fetchTransactionHistory = async (walletAddress) => {
    const response = await fetch(`/api/transactions/${walletAddress}`);
    return response.json();
  };
  
  export const sendTransaction = async (transactionData) => {
    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData),
    });
    return response.json();
  };
  