const Booking = require("../models/Booking");
const bookingBot = require("../bots/bookingBot");

const adminId = process.env.ADMIN_TELEGRAM_ID;

exports.getUnavailableDates = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "confirmed" });
    const dates = bookings.map((b) => ({
      from: b.dateFrom,
      to: b.dateTo,
    }));
    res.json(dates);
  } catch (err) {
    console.error("Ошибка получения дат:", err.message);
    res.status(500).json({ message: "Ошибка получения дат" });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { name, telegram, guests, dateFrom, dateTo } = req.body;

    // Проверка наличия обязательных полей
    if (!name || !dateFrom || !dateTo) {
      return res.status(400).json({ message: "Имя и даты обязательны" });
    }

    // Проверка имени
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Некорректное имя" });
    }

    // Проверка количества гостей
    const guestsNumber = Number(guests);
    if (!guestsNumber || guestsNumber < 1 || guestsNumber > 4) {
      return res.status(400).json({ message: "Гостей должно быть от 1 до 4" });
    }

    // Преобразуем даты
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // убираем время

    // Дата начала >= сегодня
    if (from < today) {
      return res
        .status(400)
        .json({ message: "Нельзя бронировать задним числом" });
    }

    // Дата окончания >= даты начала
    if (to < from) {
      return res
        .status(400)
        .json({ message: "Дата окончания не может быть раньше начала" });
    }

    // Продолжительность ≤ 7 дней
    const diffDays = (to - from) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res
        .status(400)
        .json({ message: "Максимальная продолжительность — 7 дней" });
    }

    // Проверка на пересечения с другими подтверждёнными бронями
    const conflict = await Booking.findOne({
      status: "confirmed",
      $or: [
        { dateFrom: { $lte: to }, dateTo: { $gte: from } }, // пересекаются
      ],
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

    const message = `
🏡 *Новая бронь квартиры!*

👤 *Имя:* ${booking.name}
📨 *Telegram:* ${booking.telegram || "не указано"}
👥 *Гостей:* ${booking.guests}

📅 *Период:*
с *${formatDate(booking.dateFrom)}* по *${formatDate(booking.dateTo)}*

🕒 Забронировано: ${formatDate(new Date())}
`;

    await bookingBot.sendMessage(process.env.ADMIN_TELEGRAM_ID, message, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Принять", callback_data: `approve_${booking._id}` },
            { text: "❌ Отклонить", callback_data: `reject_${booking._id}` },
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
