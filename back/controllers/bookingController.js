const TelegramBot = require("node-telegram-bot-api");
const Booking = require("../models/Booking");
const bookingBot = require("../bots/bookingBot");

const adminId = process.env.ADMIN_TELEGRAM_ID;

/**
 * Экранирует текст для MarkdownV2
 */
function escapeMarkdown(text) {
  if (!text) return "";
  return text.toString().replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, "\\$1");
}

exports.createBooking = async (req, res) => {
  try {
    const { name, telegram, guests, dateFrom, dateTo } = req.body;

    // Валидации
    if (!name || !dateFrom || !dateTo) {
      return res.status(400).json({ message: "Имя и даты обязательны" });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Некорректное имя" });
    }

    const guestsNumber = Number(guests);
    if (!guestsNumber || guestsNumber < 1 || guestsNumber > 4) {
      return res.status(400).json({ message: "Гостей должно быть от 1 до 4" });
    }

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (from < today) {
      return res
        .status(400)
        .json({ message: "Нельзя бронировать задним числом" });
    }

    if (to < from) {
      return res
        .status(400)
        .json({ message: "Дата окончания не может быть раньше начала" });
    }

    const diffDays = (to - from) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res
        .status(400)
        .json({ message: "Максимальная продолжительность — 7 дней" });
    }

    const conflict = await Booking.findOne({
      status: "confirmed",
      $or: [{ dateFrom: { $lte: to }, dateTo: { $gte: from } }],
    });

    if (conflict) {
      return res.status(409).json({ message: "Выбранные даты уже заняты" });
    }

    // Сохраняем бронь
    const booking = await Booking.create({
      name: name.trim(),
      telegram: telegram?.trim() || "",
      guests: guestsNumber,
      dateFrom: from,
      dateTo: to,
    });

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    // Экранируем каждый текст
    const escapedName = escapeMarkdown(booking.name);
    const escapedTelegram = escapeMarkdown(booking.telegram || "не указано");
    const escapedGuests = escapeMarkdown(booking.guests);
    const escapedFrom = escapeMarkdown(formatDate(booking.dateFrom));
    const escapedTo = escapeMarkdown(formatDate(booking.dateTo));
    const escapedNow = escapeMarkdown(formatDate(new Date()));

    const message = `
🏡 *Новая бронь квартиры!*

👤 *Имя:* ${escapedName}
📨 *Telegram:* ${escapedTelegram}
👥 *Гостей:* ${escapedGuests}

📅 *Период:*
с *${escapedFrom}* по *${escapedTo}*

🕒 Забронировано: ${escapedNow}
`;

    await bookingBot.sendMessage(adminId, message, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Принять", callback_data: `approve:${booking._id}` },
            { text: "❌ Отклонить", callback_data: `reject:${booking._id}` },
          ],
        ],
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Ошибка при создании брони:", err.message);
    res.status(500).json({
      message: "Внутренняя ошибка сервера при создании брони",
      error: err.message,
    });
  }
};
