require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

// Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN); // Replace with your bot token

// Log token loading
console.log("Loaded token from .env:", process.env.TELEGRAM_BOT_TOKEN ? "Yes" : "No");

// Initial greeting
bot.start((ctx) => {
  console.log("Received /start command");
  ctx.reply("BNBLink welcomes you! Please type /help to know about the functionalities of the bot.");
});

// Help command to show available functionalities
bot.command('help', (ctx) => {
  console.log("Received /help command");
  const helpMessage = `
Here are the commands you can use with BNBLink:
1️⃣ /create - Create a new wallet.
2️⃣ /getinfo <wallet_address> - Get detailed information about a wallet.
3️⃣ /balance <wallet_address> - Check the balance of a specific wallet.
4️⃣ /transfer <to_address> <amount> - Transfer tokens to another wallet.
5️⃣ /buy <amount> - Buy BNB tokens. (Coming Soon 🚧)
6️⃣ /sell <amount> - Sell BNB tokens. (Coming Soon 🚧)
7️⃣ /history <wallet_address> - Get transaction history of a wallet.
8️⃣ /analyze - Get the latest market analysis for BNB.
9️⃣ /subscribe - Subscribe to daily market updates.
🔟 /unsubscribe - Stop receiving daily market updates.
1️⃣1️⃣ /setAlert <price_limit> - Get an alert when BNB price goes above your set limit.
  `;
  ctx.reply(helpMessage);
});

// Create Wallet
bot.command('create', async (ctx) => {
  console.log("Received /create command");
  try {
    const response = await axios.post('http://localhost:3000/api/createwallet');
    const { walletAddress, privateKey } = response.data;
    ctx.reply(`Your new wallet has been created: ${walletAddress}. Keep your private key safe: ${privateKey}`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to create wallet. Please try again.");
  }
});

// Get Wallet Info
bot.command('getwalletinfo', async (ctx) => {
  console.log("Received /getwalletinfo command");
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    ctx.reply("Usage: /getwalletinfo <wallet_address>");
    return;
  }
  const walletAddress = args[1];
  try {
    const response = await axios.get(`http://localhost:3000/api/getwalletinfo/${walletAddress}`);
    ctx.reply(`Wallet Info:\n${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to fetch wallet info. Please try again.");
  }
});

// Get Wallet Balance
bot.command('balance', async (ctx) => {
  console.log("Received /balance command");
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    ctx.reply("Usage: /balance <wallet_address>");
    return;
  }
  const walletAddress = args[1];
  try {
    const response = await axios.get(`http://localhost:3000/api/balance/${walletAddress}`);
    ctx.reply(`The balance of wallet ${walletAddress} is: ${response.data.balance} BNB`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to fetch balance. Please try again.");
  }
});

// Launch the bot
bot.launch()
  .then(() => console.log("Bot is running..."))
  .catch((error) => {
    console.error("Failed to launch the bot:", error);
  });
