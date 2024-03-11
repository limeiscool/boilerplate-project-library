/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../models/schema.js");
const mongoose = require("mongoose");

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
      if (!bookid || bookid.length === 0) {
        return res.status(400).json({ error: "missing required field id" });
      }
      Book.deleteOne({ _id: bookid })
        .then(() => {
          res.json({ success: "delete successful" });
        })
        .catch((e) => {
          res.status(404).json({ error: "no book exists" });
        });
      //if successful response will be 'delete successful'
    });
};
