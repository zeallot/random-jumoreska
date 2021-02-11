const { tokenTelegram, ownerId } = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(tokenTelegram, { polling: true });
const jumoreski = require('./aneks.json');

// temporary solution
const logs = {
  messageCount: 0,
  userList: [],
};

const logUserMessage = ({ id, username }) => {
  logs.messageCount += 1;

  if (!logs.userList.includes(username)) {
    logs.userList.push(username || id);
  }

  console.log(logs);
};

const getRandomAnek = () => {
  return jumoreski[Math.floor(Math.random() * jumoreski.length)];
};

const sendAnek = (anek, chatId) => {
  bot.sendMessage(chatId, anek.text);
  if (anek?.photoUrl) {
    bot.sendPhoto(chatId, anek.photoUrl);
  }
};

const sendStats = (requesterId, chatId) => {
  if (requesterId === ownerId) {
    bot.sendMessage(
      chatId,
      `Message count: ${logs.messageCount}, users count: ${logs.userList.length}`
    );
  }
};

const sendResponse = (msg) => {
  logUserMessage(msg.from);
  const chatId = msg.chat.id;
  const requesterId = msg.from.id;

  switch (msg.text) {
    case '/roll':
      sendAnek(getRandomAnek(), chatId);
      break;
    case '/stat':
      sendStats(requesterId, chatId);
      break;
    default:
      bot.sendMessage(chatId, 'Могу только в команду /roll');
  }
};

bot.on('message', (msg) => sendResponse(msg));
