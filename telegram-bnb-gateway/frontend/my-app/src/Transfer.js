import React, { useState } from 'react';

const Transfer = () => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransfer = () => {
        if (!recipient || !amount) {
            alert("Please fill out both fields.");
            return;
        }

        // Call the backend API to initiate token transfer
        fetch('/api/transfer', {
            method: 'POST',
            body: JSON.stringify({ recipient, amount }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => alert(`Transfer successful: ${data.status}`))
        .catch(error => alert('Error with transfer'));
    };

    return (
        <div>
            <h2>Transfer BNB</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Recipient Address:</label>
                    <input 
                        type="text" 
                        value={recipient} 
                        onChange={(e) => setRecipient(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Amount:</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                    />
                </div>
                <button type="button" onClick={handleTransfer}>Transfer</button>
            </form>
        </div>
    );
};

export default Transfer;
    