import React, { useState } from 'react';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Footer from './Footer'; // Import Footer

const MarketAlertsScreen = () => {
  const [token, setToken] = useState('BNB');
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const handleSubscribe = () => {
    // Add logic for subscribing to market alerts
    setAlertsEnabled(true);
    alert(`Subscribed to market alerts for ${token}`);
  };

  return (
    <Container>
      <Box textAlign="center" marginTop={5}>
        <Typography variant="h4" marginBottom={3}>
          Market Analysis Alerts
        </Typography>

        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Token</InputLabel>
          <Select value={token} onChange={(e) => setToken(e.target.value)} label="Token">
            <MenuItem value="BNB">BNB</MenuItem>
            <MenuItem value="BEP-20">BEP-20</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSubscribe} disabled={alertsEnabled}>
          {alertsEnabled ? 'Subscribed' : 'Subscribe to Alerts'}
        </Button>
      </Box>

      {/* Add Footer here */}
      <Footer />
    </Container>
  );
};

export default MarketAlertsScreen;
