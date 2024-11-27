import React, { useState, useEffect } from 'react';

const Wallet = () => {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        // Fetch the balance from the backend API (make sure the backend is running)
        fetch('/api/getBalance')
            .then((response) => response.json())
            .then((data) => setBalance(data.balance))
            .catch((error) => console.error("Error fetching balance", error));
    }, []);

    return (
        <div>
            <h2>Your Wallet Balance</h2>
            {balance ? (
                <p>BNB: {balance}</p>
            ) : (
                <p>Loading balance...</p>
            )}
        </div>
    );
};

export default Wallet;
