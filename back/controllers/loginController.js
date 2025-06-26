const Student = require("../models/Student");
const { loginCodes } = require("../bots/authBot");

const botAuth = require("../bots/authBot");

exports.requestLoginCode = async (req, res) => {
  const { telegram } = req.body;

  if (!telegram) {
    return res.status(400).json({ error: "Telegram обязателен" });
  }

  const student = await Student.findOne({ telegram });
  if (!student || !student.chatId) {
    return res
      .status(404)
      .json({ error: "Пользователь не найден или не связался с ботом" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  loginCodes.set(telegram, { code, expires: Date.now() + 5 * 60 * 1000 }); // 5 минут

  await botAuth.sendMessage(student.chatId, `🔐 Ваш код для входа: ${code}`);

  return res.json({ success: true });
};

exports.verifyLoginCode = async (req, res) => {
  const { telegram, code } = req.body;

  const entry = loginCodes.get(telegram);
  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(401).json({ error: "Неверный или просроченный код" });
  }

  const student = await Student.findOne({ telegram });
  if (!student) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { id: student._id, telegram: student.telegram },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  loginCodes.delete(telegram); // удалим, т.к. использован

  return res.json({
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
};
