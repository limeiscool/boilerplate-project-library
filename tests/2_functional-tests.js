/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", function (done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");
  //       assert.property(
  //         res.body[0],
  //         "commentcount",
  //         "Books in array should contain commentcount"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "title",
  //         "Books in array should contain title"
  //       );
  //       assert.property(
  //         res.body[0],
  //         "_id",
  //         "Books in array should contain _id"
  //       );
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    let id = "";

    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "functional testing" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(res.body, "_id");
              assert.isString(res.body._id, "id should be a string");
              assert.property(res.body, "title");
              assert.isString(res.body.title, "title should be a string");
              id = res.body._id;
              console.log(id);
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end((err, res) => {
              assert.equal(res.status, 400);
              assert.property(res.body, "error");
              assert.isString(res.body.error, "error should be a string");
              assert.equal(res.body.error, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            res.body.forEach((book) => {
              assert.property(book, "_id");
              assert.isString(book._id, "id should be a string");
              assert.property(book, "title");
              assert.isString(book.title, "title should be a string");
              assert.property(book, "commentCount");
              assert.isNumber(
                book.commentCount,
                "commentCount should be a number"
              );
            });
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/123456789012345")
          .end((err, res) => {
            assert.equal(res.status, 404);
            assert.property(res.body, "error");
            assert.equal(res.body.error, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.property(res.body, "_id");
            assert.isString(res.body._id, "id should be a string");
            assert.equal(res.body._id, id);
            assert.property(res.body, "title");
            assert.isString(res.body.title, "title should be a string");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments, "comments should be an array");
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .send({ comment: "functional testing comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(res.body, "_id");
              assert.isString(res.body._id, "id should be a string");
              assert.equal(res.body._id, id);
              assert.property(res.body, "title");
              assert.isString(res.body.title, "title should be a string");
              assert.property(res.body, "commentCount");
              assert.isNumber(
                res.body.commentCount,
                "commentCount should be a number"
              );
              assert.property(res.body, "comments");
              assert.isArray(res.body.comments, "comments should be an array");
              // comment
              assert.isObject(
                res.body.comments[0],
                "comment should be an object"
              );
              assert.property(res.body.comments[0], "_id");
              assert.isString(
                res.body.comments[0]._id,
                "comment id should be a string"
              );
              assert.property(res.body.comments[0], "comment");
              assert.equal(
                res.body.comments[0].comment,
                "functional testing comment"
              );
              assert.property(res.body.comments[0], "date");
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post(`/api/books/${id}`)
            .send({ comment: "" })
            .end((err, res) => {
              assert.equal(res.status, 400);
              assert.property(res.body, "error");
              assert.equal(res.body.error, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/123456789012345")
            .send({ comment: "functional testing with non-valid id" })
            .end((err, res) => {
              assert.equal(res.status, 404);
              assert.property(res.body, "error");
              assert.equal(res.body.error, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .delete(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "success");
            assert.equal(res.body.success, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/123456789")
          .end((err, res) => {
            assert.equal(res.status, 404);
            assert.property(res.body, "error");
            assert.equal(res.body.error, "no book exists");
            done();
          });
      });
    });
  });
});
