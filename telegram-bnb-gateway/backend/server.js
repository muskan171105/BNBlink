const express = require('express');
const transactionRoutes = require('./routes/transaction');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();

// Use transaction routes
app.use('/transactions', transactionRoutes);

// Use middlewares
app.use(errorHandler);
app.use(logger);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
