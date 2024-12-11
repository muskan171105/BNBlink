import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Footer from './Footer'; // Import Footer

const HomeScreen = () => {
  return (
    <Container>
      <Box textAlign="center" marginTop={5}>
        <Typography variant="h2">BNBLink</Typography>
        <Typography variant="h6" color="textSecondary" marginBottom={3}>
          Your gateway to the BNB Chain
        </Typography>

        <Button
          component={Link}
          to="/connect-wallet"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginBottom: '10px' }}
        >
          Connect/Create Wallet
        </Button>

        <Button
          component={Link}
          to="/transfer-tokens"
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          style={{ marginBottom: '10px' }}
        >
          Transfer Tokens
        </Button>

        <Button
          component={Link}
          to="/transaction-history"
          variant="outlined"
          color="default"
          fullWidth
          size="large"
          style={{ marginBottom: '10px' }}
        >
          Transaction History
        </Button>

        <Button
          component={Link}
          to="/market-alerts"
          variant="outlined"
          color="default"
          fullWidth
          size="large"
          style={{ marginBottom: '10px' }}
        >
          Market Analysis Alerts
        </Button>

        <Button
          component={Link}
          to="/price-alerts"
          variant="outlined"
          color="default"
          fullWidth
          size="large"
        >
          Price Alerts
        </Button>
      </Box>

      {/* Add Footer here */}
      <Footer />
    </Container>
  );
};

export default HomeScreen;
