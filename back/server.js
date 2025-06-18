const TelegramBot = require("node-telegram-bot-api");
const {
  saveMessage,
  getMessagesByTelegramId,
} = require("./controllers/userController");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./conf/dataBase");
const mainPromt = require("./generalPromt");
const errorHandler = require("./middlewares/errorHandler");
const studentRoutes = require("./routes/studentRoutes");
const Student = require("./models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // 👈 Должна быть до app.post("/api/send-code")

app.use(cors());

app.use("/api/students", studentRoutes);

app.use(errorHandler);

const OpenAI = require("openai");
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bot = new TelegramBot(process.env.BOT_TOKEN_TURISM, { polling: true });
const botAuth = new TelegramBot(process.env.BOT_TOKEN_AUTHORIZE, {
  polling: true,
});

const adminId = process.env.ADMIN_TELEGRAM_ID;

app.post("/api/login", async (req, res) => {
  const { telegram, password } = req.body;

  if (!telegram || !password) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  try {
    const student = await Student.findOne({ telegram });

    if (!student) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign(
      { id: student._id, telegram: student.telegram },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        telegram: student.telegram,
        email: student.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

const pendingRegistrations = new Map(); // временное хранилище

app.post("/api/send-code", async (req, res) => {
  const studentData = req.body;

  if (!studentData.telegram) {
    return res.status(400).json({ error: "Telegram обязателен" });
  }

  const requestId = Date.now().toString(); // уникальный ID
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

  botAuth.sendMessage(adminId, messageText, {
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
});

app.get("/api/status/:telegram", async (req, res) => {
  try {
    const student = await Student.findOne({ telegram: req.params.telegram });

    if (!student) {
      return res.json({ status: "pending" });
    }

    return res.json({ status: "approved" });
  } catch (err) {
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

botAuth.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const messageId = query.message.message_id;

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
        const existing = await Student.findOne({
          telegram: studentData.telegram,
        });
        if (existing) {
          await botAuth.editMessageText(
            "⚠️ Этот Telegram уже зарегистрирован",
            {
              chat_id: chatId,
              message_id: messageId,
            }
          );
          pendingRegistrations.delete(requestId);
          return;
        }

        const hashedPassword = await bcrypt.hash(studentData.password, 10);
        const student = new Student({
          ...studentData,
          password: hashedPassword,
        });
        await student.save();

        await botAuth.editMessageText(
          "✅ Регистрация подтверждена и сохранена в БД",
          {
            chat_id: chatId,
            message_id: messageId,
          }
        );

        pendingRegistrations.delete(requestId);
      } catch (err) {
        await botAuth.sendMessage(
          chatId,
          `❌ Ошибка при сохранении: ${err.message}`
        );
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
});

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

const pendingResets = new Map(); // email => статус

app.post("/api/request-password-reset", async (req, res) => {
  const { telegram } = req.body;

  if (!telegram) return res.status(400).json({ error: "Telegram обязателен" });

  const student = await Student.findOne({ telegram }); // ✅ Ищем по telegram
  if (!student)
    return res.status(404).json({ error: "Пользователь не найден" });

  const resetId = Date.now().toString();
  pendingResets.set(resetId, { telegram, approved: false });

  const message = `🔁 Запрос на восстановление пароля:
📨 Telegram: ${telegram}`;

  botAuth.sendMessage(adminId, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Одобрить", callback_data: `reset_approve_${resetId}` }],
      ],
    },
  });

  res.json({ success: true });
});

botAuth.on("callback_query", async (query) => {
  const data = query.data;

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
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
    });

    return botAuth.answerCallbackQuery(query.id);
  }
});

app.get("/api/check-reset-status/:telegram", (req, res) => {
  const telegram = req.params.telegram;
  const entry = [...pendingResets.values()].find(
    (r) => r.telegram === telegram
  );
  if (!entry) return res.json({ status: "pending" });
  return res.json({ status: entry.approved ? "approved" : "pending" });
});

app.post("/api/confirm-new-password", async (req, res) => {
  const { telegram, newPassword } = req.body;

  const student = await Student.findOne({ telegram });
  if (!student)
    return res.status(404).json({ error: "Пользователь не найден" });

  const hashed = await bcrypt.hash(newPassword, 10);
  student.password = hashed;
  await student.save();

  for (const [key, val] of pendingResets.entries()) {
    if (val.telegram === telegram) pendingResets.delete(key);
  }

  res.json({ success: true });
});

botAuth.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const telegram = msg.from.username;

  await Student.updateOne({ telegram }, { chatId });

  bot.sendMessage(
    chatId,
    "✅ Отлично! Теперь вы можете авторизоваться на сайте"
  );
});

const loginCodes = new Map(); // telegram => { code, expires }

app.post("/api/request-login-code", async (req, res) => {
  const { telegram } = req.body;

  const student = await Student.findOne({ telegram });
  if (!student || !student.chatId)
    return res
      .status(404)
      .json({ error: "Пользователь не найден или не связался с ботом" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  loginCodes.set(telegram, { code, expires: Date.now() + 5 * 60 * 1000 });

  await botAuth.sendMessage(student.chatId, `🔐 Ваш код для входа: ${code}`);

  return res.json({ success: true });
});

app.post("/api/verify-login-code", async (req, res) => {
  const { telegram, code } = req.body;
  const entry = loginCodes.get(telegram);

  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(401).json({ error: "Неверный или просроченный код" });
  }

  const student = await Student.findOne({ telegram });
  if (!student) return res.status(404).json({ error: "Пользователь не найден" });

  const token = jwt.sign(
    { id: student._id, telegram: student.telegram },
    process.env.JWT_SECRET
  );

  loginCodes.delete(telegram);

  res.json({
    success: true,
    token,
    student: {
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      telegram: student.telegram,
      email: student.email,
    },
  });
});

// botAuth.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const telegram = msg.from.username;
//   const text = msg.text;

//   // Сохраняем chatId при первом сообщении
//   await Student.updateOne({ telegram }, { chatId });

//   // Приветственное сообщение (если новое)
//   if (text === "/start") {
//     botAuth.sendMessage(chatId, "✅ Вы успешно подключились к системе! Теперь можете авторизоваться на сайте.");
//     return;
//   }

//   // ChatGPT часть
//   await saveMessage(chatId, text, "user");
//   const context = await getMessagesByTelegramId(chatId);

//   const completion = await client.chat.completions.create({
//     messages: [
//       { role: "developer", content: mainPromt },
//       ...context.slice(-20),
//       {
//         role: "developer",
//         content: `!!! Пиши ответы в json формате:
// {
//   "textContent": "твое сообщение",
//   "buttons": []
// }`,
//       },
//     ],
//     model: "gpt-4.1",
//     store: true,
//   });

//   const parsed = JSON.parse(completion.choices[0].message.content);

//   await saveMessage(chatId, parsed.textContent, "assistant");

//   if (parsed.buttons?.length) {
//     const inlineKeyboard = parsed.buttons.map((btn) => [
//       {
//         text: btn,
//         callback_data: btn.toLowerCase().replace(/\s+/g, "_").slice(0, 64),
//       },
//     ]);
//     bot.sendMessage(chatId, parsed.textContent, {
//       reply_markup: { inline_keyboard: inlineKeyboard },
//     });
//   } else {
//     bot.sendMessage(chatId, parsed.textContent);
//   }
// });



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`!!! Server is running on http://localhost:${PORT}`);
});
