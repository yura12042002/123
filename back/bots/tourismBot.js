const TelegramBot = require("node-telegram-bot-api");
const {
  saveMessage,
  getMessagesByTelegramId,
} = require("../controllers/userController");
const client = require("../conf/openai");
const mainPromt = require("../generalPromt");
const Booking = require("../models/Booking");

async function getUnavailableDatesFormatted() {
  const bookings = await Booking.find({ status: "confirmed" });

  if (!bookings.length) return "Сейчас нет занятых дат — всё свободно! 🎉";

  return bookings
    .map((b) => {
      const from = new Date(b.dateFrom).toLocaleDateString("ru-RU");
      const to = new Date(b.dateTo).toLocaleDateString("ru-RU");
      return `📆 Занято с ${from} по ${to}`;
    })
    .join("\n");
}

const bot = new TelegramBot(process.env.BOT_TOKEN_TURISM, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const unavailableDates = await getUnavailableDatesFormatted();

  if (!text || text.startsWith("/")) return;

  try {
    await saveMessage(chatId, text, "user");

    const context = await getMessagesByTelegramId(chatId);

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "developer",
          content: mainPromt,
        },
        {
          role: "system",
          content: `Вот текущие занятые даты:\n${unavailableDates}\n\nТы — дружелюбный помощник Юрия. Не предлагай бронирование на уже занятые даты.`,
        },
        ...context.slice(-20),
        {
          role: "developer",
          content: `!!! Пиши ответы в json формате  это очень важно :
{
        "textContent": "твое сообщение",
        "buttons": [] // массив строк с кнопками на которые может нажать пользователь пиши их отталкиваясь от контекста сообщений
}
!!! предлагай варианты ответа только те, на которые ты знаешь ответ из текста, если понимаешь что клиент готов забронировать в сообщении отдельно укажи способ связи со мной, ссылка на мой тг - @yurasokol, также добавляй прикольные смайлики к кнопкам выше это очень важно`,
        },
      ],
      model: "gpt-4.1",
      store: true,
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    await saveMessage(
      chatId,
      completion.choices[0].message.content,
      "assistant"
    );

    if (parsed.buttons?.length) {
      const inlineKeyboard = parsed.buttons.map((btn) => [
        {
          text: btn,
          callback_data: btn.toLowerCase().replace(/\s+/g, "_").slice(0, 64),
        },
      ]);

      bot.sendMessage(chatId, parsed.textContent, {
        reply_markup: { inline_keyboard: inlineKeyboard },
      });
    } else {
      bot.sendMessage(chatId, parsed.textContent);
    }
  } catch (err) {
    console.error("Ошибка в tourismBot:", err.message);
    bot.sendMessage(
      chatId,
      `😔 Упс, что-то пошло не так. Но ты всегда можешь написать мне напрямую, и я помогу: @yurasokol\n\nПопробуй повторить запрос чуть позже 🙌`
    );
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  try {
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
          content: `!!! Пиши ответы в json формате:
{
  "textContent": "твое сообщение",
  "buttons": []
}`,
        },
      ],
      model: "gpt-4.1",
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    await saveMessage(chatId, parsed.textContent, "assistant");

    if (parsed.buttons?.length) {
      const inlineKeyboard = parsed.buttons.map((btn) => [
        {
          text: btn,
          callback_data: btn.toLowerCase().replace(/\s+/g, "_").slice(0, 64),
        },
      ]);

      bot.sendMessage(chatId, parsed.textContent, {
        reply_markup: { inline_keyboard: inlineKeyboard },
      });
    } else {
      bot.sendMessage(chatId, parsed.textContent);
    }

    bot.answerCallbackQuery(query.id);
  } catch (err) {
    console.error("Ошибка в callback_query:", err.message);
    bot.sendMessage(chatId, "❌ Произошла ошибка. Попробуйте позже.");
  }
});

module.exports = bot;
