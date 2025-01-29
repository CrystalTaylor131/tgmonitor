const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const axios = require('axios');

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

async function getBTCPrice() {
  try {
    const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    const data = response.data;
    const priceUSD = data.bpi.USD.rate;
    const lastUpdated = data.time.updated;
    return {
      success: true,
      price: priceUSD,
      updated: lastUpdated
    };
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    return {
      success: false,
      error: '获取价格失败'
    };
  }
}

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
        ],
        [
          {
            text: '💰 BTC价格',
            callback_data: 'btc_price'
          }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, '欢迎使用用户名显示机器人！点击下方按钮查看您的用户名：', opts);
});

bot.on('callback_query', async (callbackQuery) => {
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
  } else if (data === 'btc_price') {
    bot.answerCallbackQuery(callbackQuery.id, {
      text: '正在获取BTC价格...',
      show_alert: false
    });
    
    const priceData = await getBTCPrice();
    
    if (priceData.success) {
      const priceInfo = `💰 比特币当前价格\n\n💵 USD: ${priceData.price}\n📅 更新时间: ${priceData.updated}`;
      bot.sendMessage(chatId, priceInfo);
    } else {
      bot.sendMessage(chatId, `❌ ${priceData.error}`);
    }
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
        ],
        [
          {
            text: '💰 BTC价格',
            callback_data: 'btc_price'
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