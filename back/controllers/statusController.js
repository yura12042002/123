const Student = require("../models/Student");
const { pendingResets } = require("../bots/authBot");

exports.getRegistrationStatus = async (req, res) => {
  try {
    const student = await Student.findOne({ telegram: req.params.telegram });

    if (!student) {
      return res.json({ status: "pending" });
    }

    return res.json({ status: "approved" });
  } catch (err) {
    return res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.getResetStatus = (req, res) => {
  const telegram = req.params.telegram;
  const entry = [...pendingResets.values()].find((r) => r.telegram === telegram);

  if (!entry) return res.json({ status: "pending" });

  return res.json({ status: entry.approved ? "approved" : "pending" });
};
