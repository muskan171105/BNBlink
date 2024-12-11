import React, { useState } from 'react';
import { Button, Container, TextField, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import Footer from './Footer'; // Import Footer

const TransferTokensScreen = () => {
  const [token, setToken] = useState('BNB');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    // Implement token transfer logic here
    alert('Tokens transferred successfully!');
  };

  return (
    <Container>
      <Box textAlign="center" marginTop={5}>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Token</InputLabel>
          <Select value={token} onChange={(e) => setToken(e.target.value)} label="Token">
            <MenuItem value="BNB">BNB</MenuItem>
            <MenuItem value="BEP-20">BEP-20 Token</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Recipient Address"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleTransfer}
        >
          Send Tokens
        </Button>
      </Box>

      {/* Add Footer here */}
      <Footer />
    </Container>
  );
};

export default TransferTokensScreen;
