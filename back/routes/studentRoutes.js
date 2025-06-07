const express = require("express");
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const validateStudent = require("../middlewares/validateStudent");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", validateStudent, registerStudent); 
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.patch("/:id", validateStudent, updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
