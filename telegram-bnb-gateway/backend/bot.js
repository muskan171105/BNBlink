const { Telegraf } = require('telegraf');
const axios = require('axios');

// Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN); // Replace with your bot token

// Initial greeting
bot.start((ctx) => {
  ctx.reply("BNBLink welcomes you! Please type /help to know about the functionalities of the bot.");
});

// Help command to show available functionalities
bot.command('help', (ctx) => {
  const helpMessage = `
Here are the commands you can use with BNBLink:
1️⃣ /createwallet - Create a new wallet.
2️⃣ /getwalletinfo <wallet_address> - Get detailed information about a wallet.
3️⃣ /balance <wallet_address> - Check the balance of a specific wallet.
4️⃣ /transfer <to_address> <amount> - Transfer tokens to another wallet.
5️⃣ /buyBNB <amount> - Buy BNB tokens. (Coming Soon 🚧)
6️⃣ /sellBNB <amount> - Sell BNB tokens. (Coming Soon 🚧)
7️⃣ /history <wallet_address> - Get transaction history of a wallet.
8️⃣ /analyzeBNB - Get the latest market analysis for BNB.
9️⃣ /subscribeBNB - Subscribe to daily market updates.
🔟 /unsubscribeBNB - Stop receiving daily market updates.
1️⃣1️⃣ /setAlert <price_limit> - Get an alert when BNB price goes above your set limit.
  `;
  ctx.reply(helpMessage);
});

// Create Wallet
bot.command('createwallet', async (ctx) => {
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

// Transfer Tokens
bot.command('transfer', async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 3) {
    ctx.reply("Usage: /transfer <to_address> <amount>");
    return;
  }
  const [_, toAddress, amount] = args;
  try {
    const response = await axios.post('http://localhost:3000/api/transfer', { toAddress, amount });
    ctx.reply(`Successfully transferred ${amount} BNB to ${toAddress}`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to transfer tokens. Please try again.");
  }
});

// Transaction History
bot.command('history', async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    ctx.reply("Usage: /history <wallet_address>");
    return;
  }
  const walletAddress = args[1];
  try {
    const response = await axios.get(`http://localhost:3000/api/history/${walletAddress}`);
    ctx.reply(`Transaction history for ${walletAddress}:\n${JSON.stringify(response.data, null, 2)}`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to fetch transaction history. Please try again.");
  }
});

// Market Analysis
bot.command('analyzeBNB', async (ctx) => {
  try {
    const response = await axios.get('http://localhost:3000/api/analyzeBNB');
    const { price, change, marketCap } = response.data;
    ctx.reply(`Market Analysis for BNB:\n- Current Price: ${price} USD\n- 24hr Change: ${change}%\n- Market Cap: ${marketCap} USD`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to fetch market analysis. Please try again.");
  }
});

// Subscribe to Market Updates
bot.command('subscribeBNB', async (ctx) => {
  try {
    await axios.post('http://localhost:3000/api/subscribe', { userId: ctx.from.id });
    ctx.reply("You have subscribed to daily BNB updates.");
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to subscribe. Please try again.");
  }
});

// Unsubscribe from Market Updates
bot.command('unsubscribeBNB', async (ctx) => {
  try {
    await axios.post('http://localhost:3000/api/unsubscribe', { userId: ctx.from.id });
    ctx.reply("You have unsubscribed from BNB updates.");
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to unsubscribe. Please try again.");
  }
});

// Set Price Alert
bot.command('setAlert', async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    ctx.reply("Usage: /setAlert <price_limit>");
    return;
  }
  const priceLimit = args[1];
  try {
    await axios.post('http://localhost:3000/api/setAlert', { userId: ctx.from.id, priceLimit });
    ctx.reply(`Alert set! You'll be notified when BNB price exceeds ${priceLimit} USD.`);
  } catch (error) {
    console.error(error);
    ctx.reply("Failed to set alert. Please try again.");
  }
});

// Launch the bot
bot.launch()
  .then(() => console.log("Bot is running..."))
  .catch((error) => console.error("Failed to launch the bot:", error));
