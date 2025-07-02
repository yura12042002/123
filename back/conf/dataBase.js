const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const initializeDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    }
    );
    console.log("База данных успешно подключена");
  } catch (err) {
    console.error(`Ошибка при подключении: ${err.message}`);
    process.exit(1);
  }
};

mongoose.set("debug", true);



module.exports = initializeDB;
