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
    .get(async (req, res) => {
      await Book.find()
        .then((doc) => {
          let remappedDoc = doc.map((book) => {
            return {
              _id: book._id.toString(),
              title: book.title,
              commentcount: book.comments.length,
              comments: book.comments.map((comment) => comment?.comment),
            };
          });
          return res.json(remappedDoc);
        })
        .catch((err) => {
          return res.send("error fetching from database, try again later");
        });

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async (req, res) => {
      let title = req.body.title;
      if (!title || title === undefined) {
        return res.send("missing required field title");
      }

      let newBook = new Book({ title: title });
      await newBook.save().then((savedBook) => {
        return res.json({
          _id: savedBook._id.toString(),
          title: savedBook.title,
        });
      });

      //response will contain new book object including atleast _id and title
    })

    .delete(async (req, res) => {
      await Book.deleteMany({})
        .then(() => {
          return res.send("complete delete successful");
        })
        .catch((err) => {
          return res.send("error removing all books");
        });
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      let bookid = req.params.id;
      await Book.findById(bookid)
        .then((doc) => {
          return res.json({
            _id: doc._id.toString(),
            title: doc.title,
            comments: doc.comments.map((comment) => comment?.comment),
          });
        })
        .catch((err) => {
          return res.send("no book exists");
        });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!bookid) {
        return res.send("missing required param id");
      }
      if (!comment) {
        return res.send("missing required field comment");
      }

      await Book.findById(bookid)
        .then((matchedBook) => {
          matchedBook.commentCount++;
          matchedBook.comments.push({ comment: comment });
          matchedBook.save().then((savedBook) => {
            return res.json({
              _id: savedBook._id.toString(),
              title: savedBook.title,
              commentcount: savedBook.commentCount,
              comments: savedBook.comments.map((comment) => comment?.comment),
            });
          });
        })
        .catch((err) => {
          return res.send("no book exists");
        });

      //json res format same as .get
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;

      await Book.findById(bookid)
        .then((matchedBook) => {
          matchedBook.deleteOne().then(() => {
            return res.send("delete successful");
          });
        })
        .catch((err) => {
          return res.send("no book exists");
        });

      //if successful response will be 'delete successful'
    });
};
