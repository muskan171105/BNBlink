import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import Footer from './Footer'; // Import Footer

const ConnectWalletScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleWalletConnect = () => {
    setLoading(true);
    // Placeholder for wallet connect logic
    setTimeout(() => {
      setLoading(false);
      alert('Wallet connected successfully!');
    }, 2000);
  };

  const handleCreateWallet = () => {
    setLoading(true);
    // Placeholder for wallet creation logic
    setTimeout(() => {
      setLoading(false);
      alert('Wallet created successfully!');
    }, 2000);
  };

  return (
    <Container>
      <Box textAlign="center" marginTop={5}>
        <Typography variant="h4">Connect or Create Wallet</Typography>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateWallet}
            disabled={loading}
            style={{ marginBottom: '10px' }}
          >
            Create New Wallet
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleWalletConnect}
            disabled={loading}
          >
            Connect Existing Wallet
          </Button>
        </Box>
      </Box>

      {/* Add Footer here */}
      <Footer />
    </Container>
  );
};

export default ConnectWalletScreen;
