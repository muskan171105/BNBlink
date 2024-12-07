// telegramBotService.js
const express = require("express");
const axios = require("axios");
const app = express();

app.post("/telegram/callback", (req, res) => {
  const { message } = req.body;
  // Parse the message and forward requests to respective microservices
  if (message.text === "/buyBNB") {
    // Call the Token Swap Microservice
    axios.post("http://localhost:3002/swap/buy", { amountIn: 10, tokenIn: "USDT", tokenOut: "BNB" })
      .then(response => {
        res.send("BNB bought successfully!");
      })
      .catch(error => {
        res.send("Error buying BNB.");
      });
  }
});

app.listen(3003, () => console.log("Telegram Bot service running on port 3003"));
