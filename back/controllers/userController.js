const User = require("../models/Users");

const saveMessage = async (telegramId, messageText, role) => {
  try {
    let user = await User.findOne({ telegramgId: telegramId });

    const newMessage = {
      role: role,
      content: messageText,
    };

    if (!user) {
      user = new User({
        telegramgId: telegramId,
        messages: [newMessage],
      });
    } else {
      user.messages.push(newMessage);
    }

    await user.save();
    return user;
  } catch (err) {
    console.error("Ошибка при сохранении сообщения:", err);
    throw err;
  }
};

const getMessagesByTelegramId = async (telegramId) => {
  try {
    const user = await User.findOne({ telegramgId: telegramId });

    if (!user) return null;
    return user.messages;
  } catch (err) {
    console.error("Ошибка при получении сообщений:", err);
    throw err;
  }
};

module.exports = {
  saveMessage,
  getMessagesByTelegramId,
};
