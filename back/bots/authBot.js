const TelegramBot = require("node-telegram-bot-api");
const Student = require("../models/Student");

const botAuth = new TelegramBot(process.env.BOT_TOKEN_AUTHORIZE, { polling: true });
const adminId = process.env.ADMIN_TELEGRAM_ID;

// Временные хранилища для запросов
const pendingRegistrations = new Map();
const pendingResets = new Map();
const loginCodes = new Map();

module.exports.pendingRegistrations = pendingRegistrations;
module.exports.pendingResets = pendingResets;
module.exports.loginCodes = loginCodes;

// Обработка callback-запросов от админа
botAuth.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const messageId = query.message.message_id;

  // Подтверждение регистрации
  if (data.startsWith("approve_") || data.startsWith("reject_")) {
    const [action, requestId] = data.split("_");
    const studentData = pendingRegistrations.get(requestId);

    if (!studentData) {
      return botAuth.answerCallbackQuery(query.id, {
        text: "Запрос не найден",
        show_alert: true,
      });
    }

    if (action === "approve") {
      try {
        const existing = await Student.findOne({ telegram: studentData.telegram });
        if (existing) {
          await botAuth.editMessageText("⚠️ Этот Telegram уже зарегистрирован", {
            chat_id: chatId,
            message_id: messageId,
          });
          pendingRegistrations.delete(requestId);
          return;
        }

        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(studentData.password, 10);
        const student = new Student({ ...studentData, password: hashedPassword });
        await student.save();

        await botAuth.editMessageText("✅ Регистрация подтверждена и сохранена в БД", {
          chat_id: chatId,
          message_id: messageId,
        });

        pendingRegistrations.delete(requestId);
      } catch (err) {
        await botAuth.sendMessage(chatId, `❌ Ошибка при сохранении: ${err.message}`);
      }
    }

    if (action === "reject") {
      await botAuth.editMessageText("❌ Регистрация отклонена", {
        chat_id: chatId,
        message_id: messageId,
      });
      pendingRegistrations.delete(requestId);
    }

    return botAuth.answerCallbackQuery(query.id);
  }

  // Подтверждение сброса пароля
  if (data.startsWith("reset_approve_")) {
    const resetId = data.replace("reset_approve_", "");
    const request = pendingResets.get(resetId);

    if (!request) {
      return botAuth.answerCallbackQuery(query.id, {
        text: "Запрос не найден",
        show_alert: true,
      });
    }

    request.approved = true;
    pendingResets.set(resetId, request);

    botAuth.editMessageText("✅ Пользователю разрешено сменить пароль", {
      chat_id: chatId,
      message_id: messageId,
    });

    return botAuth.answerCallbackQuery(query.id);
  }
});

// Обработка обычных сообщений (например, /start)
botAuth.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const telegram = msg.from.username;
  const text = msg.text;

  if (!telegram) return;

  await Student.updateOne({ telegram }, { chatId });

  if (text === "/start") {
    botAuth.sendMessage(
      chatId,
      "✅ Вы успешно подключились к системе! Теперь вы можете авторизоваться на сайте."
    );
  }
});

module.exports = botAuth;
