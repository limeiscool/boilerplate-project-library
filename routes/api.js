/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../models/schema.js");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title || title.length === 0)
        return res.status(400).json({ error: "missing required field title" });

      let newBook = new Book({ title: title });
      await newBook.save();
      res.json({ _id: newBook._id.toString(), title: newBook.title });
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid, (err, docs) => {
        if (err) {
          return res.status(500).json("no book exists");
        } else {
          return res.status(200).json({ success: "delete successful" });
        }
      });
      //if successful response will be 'delete successful'
    });
};
