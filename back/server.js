const TelegramBot = require("node-telegram-bot-api");
const {
  saveMessage,
  getMessagesByTelegramId,
} = require("./controllers/userController");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./conf/dataBase");
const mainPromt = require("./generalPromt");

const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());

const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const token = "8006099368:AAFCAKTMMJuKp_v21mFNLRHfdjpYLouWcFM";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  await saveMessage(chatId, text, "user");

  const context = await getMessagesByTelegramId(chatId);

  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "developer",
        content: mainPromt,
      },
      ...context.slice(-20),
      {
        role: "developer",
        content: `!!! Пиши ответы в json формате  это очень важно : 
{
        "textContent": "твое сообщение",
        "buttons": [] // массив строк с кнопками на которые может нажать пользователь пиши их отталкиваясь от контекста сообщений 
}
!!! предлагай варианты ответа только те, на которые ты знаешь ответ из текста, если понимаешь что клиент готов забронироватьв сообщении отдельно укажи способ связи со мной, ссылка на мой тг - @yurasokol, также добавляй прикольные смайлики к кнопкам выше это очень важно `,
      },
    ],
    model: "gpt-4.1",
    store: true,
  });

  const parseJSON = JSON.parse(completion.choices[0].message.content);

  if (parseJSON.buttons) {
    await saveMessage(
      chatId,
      completion.choices[0].message.content,
      "assistant"
    );

    const inlineKeyboard = parseJSON.buttons.map((btn) => [
      {
        text: btn,
        callback_data: btn.toLowerCase().replace(/\s+/g, "_").slice(0, 64),
      },
    ]);

    // виспер для преобразования голоса в текст

    bot.sendMessage(chatId, parseJSON.textContent, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } else {
    await saveMessage(
      chatId,
      completion.choices[0].message.content,
      "assistant"
    );
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  await saveMessage(chatId, data, "user");

  const context = await getMessagesByTelegramId(chatId);
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "developer",
        content: mainPromt,
      },
      ...context.slice(-20),
      {
        role: "developer",
        content: `!!! Пиши ответы в json формате  это очень важно : 
{
        "textContent": "твое сообщение",
        "buttons": [] // массив строк с кнопками на которые может нажать пользователь пиши их отталкиваясь от контекста сообщений 
}
!!! предлагай варианты ответа только те, на которые ты знаешь ответ из текста выше это очень важно `,
      },
    ],
    model: "gpt-4.1",
  });

  console.log(completion.choices[0].message.content);

  const parsed = JSON.parse(completion.choices[0].message.content);
  const buttons = Array.isArray(parsed.buttons) ? parsed.buttons : [];

  const inlineKeyboard = buttons.map((btn) => [
    {
      text: btn,
      callback_data: btn.toLowerCase().replace(/\s+/g, "_").slice(0, 64),
    },
  ]);

  await saveMessage(chatId, parsed.textContent, "assistant");

  bot.sendMessage(chatId, parsed.textContent, {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });

  bot.answerCallbackQuery(query.id);
});
