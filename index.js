const { tokenTelegram, ownerId } = require('./config');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(tokenTelegram, { polling: true });
const jumoreski = require('./aneks.json');


// temporary solution
const logs = {
  messageCount: 0,
  userList: [],
};

const logUserMessage = (user) => {
  const { id, username } = user;

  logs.messageCount += 1;

  if (!logs.userList.includes(username)) {

    if (username) {
      logs.userList.push(username);
    } else {
      logs.userList.push(id);
    }
  }
  console.log(logs);
}

const getRandomAnek = () => {
  return jumoreski[Math.floor(Math.random() * jumoreski.length)];
};

bot.on('message', (msg) => {
  logUserMessage(msg.from)
  const chatId = msg.chat.id;
  const jumoreska = getRandomAnek();

  switch (msg.text) {
    case '/roll':
      bot.sendMessage(chatId, jumoreska.text);
      if (jumoreska?.photoUrl) {
        bot.sendPhoto(chatId, jumoreska.photoUrl);
      }
      break;
    case '/stat':
      if (msg.from.id === ownerId) {
        bot.sendMessage(chatId, `Message count: ${logs.messageCount}, users count: ${logs.userList.length}`);
      }
      break;
    default:
      bot.sendMessage(chatId, 'Могу только в команду /roll')
  }
});
