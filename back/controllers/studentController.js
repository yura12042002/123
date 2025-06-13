const bcrypt = require("bcrypt");
const Student = require("../models/Student");

// ✅ Регистрация нового ученика
const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, age, email, telegram, password } = req.body;

    if (!firstName || !lastName || !email || !telegram || !password) {
      return res.status(400).json({ success: false, error: "Все поля обязательны" });
    }

    const existing = await Student.findOne({ $or: [{ email }, { telegram }] });
    if (existing) {
      return res.status(409).json({ success: false, error: "Email или Telegram уже зарегистрированы" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await Student.create({
      firstName,
      lastName,
      age,
      email,
      telegram,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, message: "Ученик успешно зарегистрирован", id: newStudent._id });
  } catch (error) {
    res.status(500).json({ success: false, error: "Ошибка регистрации: " + error.message });
  }
};

// ✅ Получение всех учеников
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: "Ошибка при загрузке списка учеников" });
  }
};

// ✅ Получение ученика по ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ success: false, message: "Ученик не найден" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: "Ошибка запроса: " + error.message });
  }
};

// ✅ Обновление ученика
const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Ученик не найден" });
    }

    res.status(200).json({ success: true, message: "Профиль обновлён", data: updatedStudent });
  } catch (error) {
    res.status(400).json({ success: false, error: "Ошибка при обновлении: " + error.message });
  }
};

// ✅ Удаление ученика
const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Ученик не найден" });
    }
    res.status(200).json({ success: true, message: "Ученик удалён" });
  } catch (error) {
    res.status(400).json({ success: false, error: "Ошибка при удалении: " + error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ success: false, message: "Ученик не найден" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
};


module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getMyProfile
};
