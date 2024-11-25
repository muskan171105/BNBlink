const TelegramBot = require('telegram-bot-api');
const bot = new TelegramBot({
  token: process.env.TELEGRAM_BOT_TOKEN,
});

bot.on('message', (msg) => {
  bot.sendMessage({ chat_id: msg.chat.id, text: "Hello, BNB user!" });
});

console.log("Bot is running...");
