const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const app = express();

// Telegram Bot secret token (You need to set this up in your bot's environment)
const TELEGRAM_BOT_SECRET = process.env.TELEGRAM_BOT_SECRET; // Replace with your actual secret token

// Middleware to parse incoming JSON requests
app.use(express.json());

// Verify if the request is coming from Telegram (via the secret token)
function verifyTelegramRequest(req) {
  const signature = req.headers['x-telegram-bot-api-secret-token'];
  return signature === TELEGRAM_BOT_SECRET;
}

app.post("/telegram/callback", async (req, res) => {
  // Security check: Ensure the request is from Telegram
  if (!verifyTelegramRequest(req)) {
    console.error("Unauthorized request attempt");
    return res.status(403).send("Forbidden");
  }

  const { message } = req.body;

  if (!message || !message.text) {
    return res.status(400).send("Invalid request: Missing message text");
  }

  // Parse the message text and forward requests to respective microservices
  try {
    if (message.text === "/buyBNB") {
      // Call the Token Swap Microservice
      const swapData = { amountIn: 10, tokenIn: "USDT", tokenOut: "BNB" };

      try {
        const response = await axios.post("http://localhost:3002/swap/buy", swapData);

        // Assuming the response from Token Swap contains a success message
        if (response.status === 200) {
          res.send("BNB bought successfully!");
        } else {
          throw new Error("Failed to buy BNB. Please try again later.");
        }
      } catch (error) {
        console.error("Error while calling Token Swap Microservice:", error);
        res.send("Error buying BNB. Please try again later.");
      }
    } else {
      res.send("Unknown command. Please send /buyBNB to purchase BNB.");
    }
  } catch (error) {
    console.error("Error processing the message:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3003, () => console.log("Telegram Bot service running on port 3003"));
