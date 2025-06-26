const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./conf/dataBase");
connectDB();

require("./bots/tourismBot");
require("./bots/authBot");

const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`!!! Server is running on http://localhost:${PORT}`);
});
