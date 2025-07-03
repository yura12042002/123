const TelegramBot = require("node-telegram-bot-api");
const Booking = require("../models/Booking");

const token = process.env.BOT_TOKEN_BOOKING;
const bot = new TelegramBot(token, { polling: true });

/**
 * Экранирует все спецсимволы для MarkdownV2
 * https://core.telegram.org/bots/api#markdownv2-style
 */
function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, "\\$1");
}

// Обработка inline-кнопок (подтвердить или отклонить бронь)
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Используем ":" вместо "_" для безопасного разделения
  const [action, bookingId] = data.split(":");

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return bot.sendMessage(chatId, "❗️Бронь не найдена");
    }

    const escapedName = escapeMarkdown(booking.name);

    // Экранируем и весь текст целиком
    const messageApprove = escapeMarkdown(`✅ Бронь подтверждена для ${escapedName}`);
    const messageReject = escapeMarkdown(`❌ Бронь отклонена для ${escapedName}`);

    if (action === "approve") {
      booking.status = "confirmed";
      await booking.save();
      await bot.sendMessage(chatId, messageApprove, {
        parse_mode: "MarkdownV2",
      });
    }

    if (action === "reject") {
      booking.status = "rejected";
      await booking.save();
      await bot.sendMessage(chatId, messageReject, {
        parse_mode: "MarkdownV2",
      });
    }

    // Удаляем кнопки после действия
    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      {
        chat_id: chatId,
        message_id: query.message.message_id,
      }
    );

  } catch (err) {
    console.error("Ошибка обработки callback:", err);
    await bot.sendMessage(
      chatId,
      "⚠️ Произошла внутренняя ошибка при обработке запроса."
    );
  }
});

module.exports = bot;
