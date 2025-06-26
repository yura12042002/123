
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const studentRoutes = require("./routes/studentRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const loginRoutes = require("./routes/loginRoutes");
const resetRoutes = require("./routes/resetRoutes");
const statusRoutes = require("./routes/statusRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/students", studentRoutes);
app.use("/api/send-code", registrationRoutes);
app.use("/api/request-login-code", loginRoutes);
app.use("/api/request-password-reset", resetRoutes);
app.use("/api", statusRoutes);

app.use(errorHandler);

module.exports = app;
