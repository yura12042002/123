// controllers/registrationController.js
const { pendingRegistrations } = require("../bots/authBot");
const Student = require("../models/Student");

const TelegramBot = require("node-telegram-bot-api");
const botAuth = new TelegramBot(process.env.BOT_TOKEN_AUTHORIZE, {
  polling: false,
});
const adminId = process.env.ADMIN_TELEGRAM_ID;

exports.sendRegistrationCode = async (req, res) => {
  const studentData = req.body;

  if (!studentData.telegram) {
    return res.status(400).json({ error: "Telegram обязателен" });
  }

  const requestId = Date.now().toString();
  pendingRegistrations.set(requestId, studentData);

  const messageText = `
👤 Новый запрос на регистрацию:

👤 Имя: ${studentData.firstName}
👤 Фамилия: ${studentData.lastName}
📅 Возраст: ${studentData.age}
📧 Email: ${studentData.email}
📨 Telegram: ${studentData.telegram}

✅ Подтвердить или ❌ отклонить?
`;

  await botAuth.sendMessage(adminId, messageText, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Подтвердить", callback_data: `approve_${requestId}` },
          { text: "❌ Отклонить", callback_data: `reject_${requestId}` },
        ],
      ],
    },
  });

  return res.json({ success: true });
};
