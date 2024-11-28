// src/App.js

import React from 'react';
import Login from './Login';
import Wallet from './Wallet';
import Transfer from './Transfer';
import DApp from './DApp'; // Import the DApp component
import './App.css';


const App = () => {
    return (
        <div>
            {/* You can control which components to show based on some condition */}
            <Login />
            <Wallet />
            <Transfer />
            <DApp /> {/* Add the DApp component here */}
        </div>
    );
};

export default App;
