import React from 'react';
import { Container, Typography, Box, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material';
import Footer from './Footer'; // Import Footer

const TransactionHistoryScreen = () => {
  // Example transaction data
  const transactions = [
    { date: '2024-12-10', token: 'BNB', amount: '1.2', status: 'Success' },
    { date: '2024-12-09', token: 'BEP-20', amount: '50', status: 'Pending' },
    { date: '2024-12-08', token: 'BNB', amount: '0.5', status: 'Success' },
  ];

  return (
    <Container>
      <Box textAlign="center" marginTop={5}>
        <Typography variant="h4" marginBottom={3}>
          Transaction History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.token}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Footer here */}
      <Footer />
    </Container>
  );
};

export default TransactionHistoryScreen;
