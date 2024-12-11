import React, { useState } from 'react';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import Footer from './Footer'; // Import Footer

const PriceAlertsScreen = () => {
  const [token, setToken] = useState('BNB');
  const [priceThreshold, setPriceThreshold] = useState('');

  const handleSaveAlert = () => {
    // Add logic for saving price alert
    alert(`Price alert set for ${token} at ${priceThreshold}`);
  };

  return (
    <Container>
      <Box textAlign="center" marginTop={5}>
        <Typography variant="h4" marginBottom={3}>
          Set Price Alert
        </Typography>

        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Token</InputLabel>
          <Select value={token} onChange={(e) => setToken(e.target.value)} label="Token">
            <MenuItem value="BNB">BNB</MenuItem>
            <MenuItem value="BEP-20">BEP-20</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Price Threshold"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
          value={priceThreshold}
          onChange={(e) => setPriceThreshold(e.target.value)}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleSaveAlert}>
          Save Alert
        </Button>
      </Box>

      {/* Add Footer here */}
      <Footer />
    </Container>
  );
};

export default PriceAlertsScreen;
