import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // For navigation to the Home screen

const Footer = () => {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fafafa', textAlign: 'center', padding: '10px' }}>
      <Button component={Link} to="/" color="primary">
        Home
      </Button>
    </Box>
  );
};

export default Footer;
