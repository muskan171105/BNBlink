import React, { useEffect } from 'react';

const Login = () => {
    useEffect(() => {
        // Check if the Telegram Web App object is available
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready(); // Initialize the Telegram Web App
        } else {
            console.error("Telegram Web App SDK is not available.");
        }
    }, []);

    const handleLogin = () => {
        // Trigger backend authentication or handle the login with Telegram
        console.log("User logged in");

        // Here, you could call your backend API or trigger Telegram WebApp login flow if applicable
    };

    return (
        <div>
            <h1>Welcome to BNB Chain Gateway</h1>
            <button onClick={handleLogin}>Login with Telegram</button>
        </div>
    );
};

export default Login;
