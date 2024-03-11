const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [
    {
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Book = mongoose.model("Book", BookSchema, "books");

module.exports = Book;
