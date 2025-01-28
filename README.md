# Telegram Monitor Bot

一个简单的 Telegram 机器人，用于显示用户信息和聊天详情。

## 功能

- 显示用户用户名和 ID
- 显示聊天信息（类型、标题、ID、语言设置）
- 响应 `/start` 命令和普通消息
- 内联键盘按钮交互

## 安装

1. 克隆项目
```bash
git clone <repository-url>
cd tgmonitor
```

2. 安装依赖
```bash
npm install
```

3. 配置机器人
创建 `config.js` 文件：
```javascript
module.exports = {
  BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE'
};
```

## 使用

### 启动机器人
```bash
npm start
```

### 开发模式
```bash
npm run dev
```

## 机器人命令

- `/start` - 启动机器人并显示欢迎消息
- 发送任意消息 - 机器人会回复并显示操作按钮

## 按钮功能

- **点击显示用户名** - 显示用户的用户名、姓名和用户 ID
- **更多信息** - 显示聊天类型、标题、ID 和语言设置

## 依赖

- `node-telegram-bot-api` - Telegram Bot API 客户端
- `nodemon` - 开发时自动重启（开发依赖）

## 配置要求

需要从 [@BotFather](https://t.me/botfather) 获取 Telegram Bot Token。