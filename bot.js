const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';
  const username = msg.from.username || '';
  
  const displayName = username ? `@${username}` : `${firstName} ${lastName}`.trim();
  
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '点击显示用户名',
            callback_data: 'show_username'
          },
          {
            text: '更多信息',
            callback_data: 'more_info'
          }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, '欢迎使用用户名显示机器人！点击下方按钮查看您的用户名：', opts);
});

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  
  if (data === 'show_username') {
    const user = callbackQuery.from;
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const username = user.username || '';
    
    let displayInfo = '';
    if (username) {
      displayInfo = `您的用户名是：@${username}`;
    } else {
      displayInfo = `您没有设置用户名，您的姓名是：${firstName} ${lastName}`.trim();
    }
    
    if (user.id) {
      displayInfo += `\n您的用户ID：${user.id}`;
    }
    
    bot.answerCallbackQuery(callbackQuery.id, {
      text: displayInfo,
      show_alert: true
    });
  } else if (data === 'more_info') {
    const user = callbackQuery.from;
    const chatInfo = msg.chat;
    
    let moreInfo = `聊天信息：\n`;
    moreInfo += `聊天类型：${chatInfo.type}\n`;
    if (chatInfo.title) {
      moreInfo += `聊天标题：${chatInfo.title}\n`;
    }
    moreInfo += `聊天ID：${chatInfo.id}\n`;
    moreInfo += `语言代码：${user.language_code || '未设置'}`;
    
    bot.answerCallbackQuery(callbackQuery.id, {
      text: moreInfo,
      show_alert: true
    });
  }
});

bot.on('message', (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';
  const username = msg.from.username || '';
  
  const displayName = username ? `@${username}` : `${firstName} ${lastName}`.trim();
  
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '点击显示用户名',
            callback_data: 'show_username'
          },
          {
            text: '更多信息',
            callback_data: 'more_info'
          }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, `你好 ${displayName}！点击下方按钮查看详细信息：`, opts);
});

bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

console.log('Bot is running...');