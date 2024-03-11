const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  let uri = process.env.MONGO_URI;
  if (!uri) return console.log("no URI given.");

  mongoose
    .connect(uri, {})
    .then((result) => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

  return;
}

module.exports = connectDB;
