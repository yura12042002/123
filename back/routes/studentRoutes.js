const express = require("express");
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getMyProfile,
} = require("../controllers/studentController");
const validateStudent = require("../middlewares/validateStudent");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getAllStudents);
router.get("/profile", authMiddleware, getMyProfile);
router.get("/:id", authMiddleware, getStudentById);
router.patch("/:id", authMiddleware, validateStudent, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

module.exports = router;
