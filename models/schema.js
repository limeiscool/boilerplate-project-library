const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  commentCount: { type: Number, default: 0 },
  comments: [commentsSchema],
});

const Book = mongoose.model("Book", BookSchema, "books");

module.exports = Book;
