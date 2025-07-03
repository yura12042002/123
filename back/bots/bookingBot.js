const TelegramBot = require("node-telegram-bot-api");
const Booking = require("../models/Booking");

const token = process.env.BOT_TOKEN_BOOKING;
const bot = new TelegramBot(token, { polling: true });

// Функция экранирования спецсимволов для Markdown
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

// Обработка inline-кнопок (подтвердить или отклонить бронь)
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const [action, bookingId] = data.split("_");

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return bot.sendMessage(chatId, "❗️Бронь не найдена");
    }

    const escapedName = escapeMarkdown(booking.name);

    if (action === "approve") {
      booking.status = "confirmed";
      await booking.save();
      await bot.sendMessage(
        chatId,
        `✅ Бронь подтверждена для *${escapedName}*`,
        { parse_mode: "Markdown" }
      );
    }

    if (action === "reject") {
      booking.status = "rejected";
      await booking.save();
      await bot.sendMessage(
        chatId,
        `❌ Бронь отклонена для *${escapedName}*`,
        { parse_mode: "Markdown" }
      );
    }

    // Убираем кнопки после действия
    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      {
        chat_id: chatId,
        message_id: query.message.message_id,
      }
    );

  } catch (err) {
    console.error("Ошибка обработки callback:", err.message);
    bot.sendMessage(chatId, "⚠️ Произошла ошибка при обработке.");
  }
});

module.exports = bot;
