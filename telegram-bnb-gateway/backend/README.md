# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
# BNBLink Backend

BNBLink is a backend service for managing wallets and transactions on the Binance Smart Chain (BNB). This project allows users to create wallets, view wallet balances, and manage transactions securely with JWT authentication.

## Features

- **Create Wallet**: Generate a new wallet (address and private key) for users.
- **View Wallet Info**: Retrieve the balance of a wallet using its address.
- **Transaction History**: View the transaction history of a wallet address.
- **Secure API Access**: Use JWT authentication to protect sensitive routes such as wallet creation and balance checking.

## Installation

### Prerequisites

1. **Node.js** (v14.x or higher)
2. **npm** (Node Package Manager)

### Steps to Set Up

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/bnb-link-backend.git
    cd bnb-link-backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret_key
    RPC_URL=your_rpc_url_for_bnb_chain
    ```

4. Start the server:
    ```bash
    npm start
    ```

    The server will be running at `http://localhost:3000`.

## API Documentation

### 1. User Registration

**Endpoint**: `POST /auth/signup`

**Description**: Registers a new user.

**Request Body**:
```json
{
  "username": "exampleUsername",
  "password": "examplePassword"
}
```

**Response**:

```json

{
  "message": "User created successfully"
}
```

### 2. User Login

**Endpoint**: `POST /auth/login`

**Description**: Logs in a user and returns a JWT token.

**Request Body**:
```json
{
  "username": "exampleUsername",
  "password": "examplePassword"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "token": "your_jwt_token_here"
}
```

### 3. Create Wallet

**Endpoint**: `POST /wallet/create`

**Description**: Creates a new wallet. Requires a valid JWT token in the Authorization header.

**Request Header**:
```bash
Authorization: Bearer <your_jwt_token_here>
```

**Response**:
```json
{
  "message": "Wallet created successfully",
  "address": "generated_wallet_address_here"
}
```

### 4. Get Wallet Info

**Endpoint**: GET /wallet/:address

**Description**: Fetches wallet information (address balance). Requires a valid JWT token in the Authorization header.

**Request Header**:
```bash
Authorization: Bearer <your_jwt_token_here>
```

**Response**:
```json
{
  "address": "wallet_address_here",
  "balance": "wallet_balance_here"
}
```

### Security
- All sensitive routes are protected with JWT authentication.
- Make sure to keep your JWT secret secure and rotate it periodically.
- Wallet private keys are securely stored and should never be exposed.
