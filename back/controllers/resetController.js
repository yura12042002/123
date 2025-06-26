const Student = require("../models/Student");
const { pendingResets } = require("../bots/authBot");
const botAuth = require("../bots/authBot");

const adminId = process.env.ADMIN_TELEGRAM_ID;

exports.requestPasswordReset = async (req, res) => {
  const { telegram } = req.body;

  if (!telegram) {
    return res.status(400).json({ error: "Telegram обязателен" });
  }

  const student = await Student.findOne({ telegram });
  if (!student) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const resetId = Date.now().toString();
  pendingResets.set(resetId, { telegram, approved: false });

  const message = `🔁 Запрос на восстановление пароля:
📨 Telegram: ${telegram}`;

  await botAuth.sendMessage(adminId, {
    text: message,
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Одобрить", callback_data: `reset_approve_${resetId}` }],
      ],
    },
  });

  res.json({ success: true });
};

exports.confirmNewPassword = async (req, res) => {
  const { telegram, newPassword } = req.body;

  const student = await Student.findOne({ telegram });
  if (!student) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const bcrypt = require("bcrypt");
  const hashed = await bcrypt.hash(newPassword, 10);

  student.password = hashed;
  await student.save();

  for (const [key, val] of pendingResets.entries()) {
    if (val.telegram === telegram) pendingResets.delete(key);
  }

  res.json({ success: true });
};
