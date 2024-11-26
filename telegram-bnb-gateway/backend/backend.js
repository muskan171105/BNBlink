const express = require('express');
const app = express();
const dotenv = require('dotenv');
const crypto = require('crypto');
const { Biconomy } = require('@biconomy/mexa');
const Web3 = require('web3');
const { getBalance } = require('./bnbService');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Biconomy and Web3 setup
const API_KEY = process.env.BICONOMY_API_KEY;
const RPC_URL = "https://bsc-dataseed.binance.org/";

const biconomy = new Biconomy(new Web3.providers.HttpProvider(RPC_URL), {
  apiKey: API_KEY,
  debug: true,
});

const web3 = new Web3(biconomy);

biconomy
  .onEvent(biconomy.READY, () => {
    console.log('Biconomy is ready');
  })
  .onEvent(biconomy.ERROR, (error) => {
    console.error('Error in Biconomy setup:', error);
  });

// Routes
app.get('/', (req, res) => {
  res.send('BNBLink Backend is running');
});

app.post('/auth/telegram', (req, res) => {
  const { hash, ...data } = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const secretKey = crypto.createHash('sha256').update(botToken).digest();

  const checkString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

  if (hmac !== hash) {
    return res.status(403).send('Authentication failed');
  }

  const jwtToken = jwt.sign({ id: data.id, username: data.username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token: jwtToken });
});

app.get('/balance/:address', async (req, res) => {
  const address = req.params.address;
  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Meta-transaction routes
app.post(
  "/sendTransaction",
  [
    body("userAddress").isString().notEmpty(),
    body("to").isString().notEmpty(),
    body("amount").isNumeric().notEmpty(),
    body("functionSignature").isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userAddress, functionSignature } = req.body;

    try {
      // Sign the meta-transaction
      const { r, s, v } = await signMetaTransaction(userAddress, functionSignature);

      // Relay the transaction
      const receipt = await relayTransaction(userAddress, functionSignature, r, s, v);
      res.status(200).send({ success: true, receipt });
    } catch (error) {
      console.error("Error in gasless transaction:", error);
      res.status(500).send({ success: false, error: error.message });
    }
  }
);

async function fetchNonce(userAddress) {
  const relayContract = new web3.eth.Contract(
    JSON.parse(process.env.RELAYER_ABI), // Parse ABI from the environment variable
    process.env.RELAYER_ADDRESS
  );

  try {
    const nonce = await relayContract.methods.getNonce(userAddress).call();
    return nonce;
  } catch (error) {
    console.error("Error fetching nonce:", error);
    throw new Error("Failed to fetch nonce");
  }
}

async function signMetaTransaction(userAddress, functionSignature) {
  const nonce = await fetchNonce(userAddress);
  const message = web3.utils.soliditySha3(userAddress, functionSignature, nonce);

  // Sign the message
  const signature = await web3.eth.sign(message, userAddress);

  // Extract v, r, and s from the signature
  const r = signature.slice(0, 66);
  const s = "0x" + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);

  return { r, s, v };
}

async function relayTransaction(userAddress, functionSignature, r, s, v) {
  const relayContract = new web3.eth.Contract(
    JSON.parse(process.env.RELAYER_ABI),
    process.env.RELAYER_ADDRESS
  );

  try {
    const tx = relayContract.methods.executeMetaTransaction(
      userAddress,
      functionSignature,
      r,
      s,
      v
    );

    const gasEstimate = await tx.estimateGas({ from: userAddress });
    const receipt = await tx.send({ from: userAddress, gas: gasEstimate });
    return receipt;
  } catch (error) {
    console.error("Error relaying transaction:", error);
    throw new Error("Relaying transaction failed.");
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
