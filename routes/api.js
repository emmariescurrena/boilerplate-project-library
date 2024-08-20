/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

    app.route('/api/books')
        .get(function (req, res) {
            Book.aggregate([{
                $project: {
                    _id: 1,
                    title: 1,
                    commentcount: { $size: '$comments' }
                }
            }])
                .then((books) => {
                    res.json(books);
                }).catch((err) => {
                    res.status(500).json(err);
                });
        })

        .post(function (req, res) {
            const title = req.body.title;

            if (!title) {
                return res.send('missing required field title');
            }

            let newBook = new Book({ title });

            newBook.save()
                .then((book) => {
                    res.json(book);
                }).catch((err) => {
                    res.status(500).json(err);
                });
        })

        .delete(function (req, res) {
            Book.deleteMany({})
                .then((_) => {
                    res.send('complete delete successful');
                }).catch((err) => {
                    res.send('error deleting books');
                })
        });


    app.route('/api/books/:id')
        .get(function (req, res) {
            let bookid = ObjectId.createFromHexString(req.params.id);
            Book.findById(bookid)
                .then((book) => {
                    if (!book) {
                        throw 'book not found ' + _id
                    }
                    res.json(book);
                }).catch((err) => {
                    res.send('no book exists');
                });
        })

        .post(function (req, res) {
            let bookId = ObjectId.createFromHexString(req.params.id);
            let comment = req.body.comment;
            if (!comment) {
                return res.send('missing required field comment');
            }

            Book.findById(bookId)
                .then((book) => {
                    if (!book) {
                        throw 'book not found ' + _id
                    }
                    book.comments.push(comment);
                    return book.save();
                })
                .then((savedBook) => {
                    res.json(savedBook);
                }).catch((err) => {
                    res.send('no book exists');
                });
        })

        .delete(function (req, res) {
            let bookId = ObjectId.createFromHexString(req.params.id);

            Book.findByIdAndDelete(bookId)
                .then((book) => {
                    if (!book) {
                        throw 'book not found ' + _id
                    }
                    res.send('delete successful');
                }).catch((err) => {
                    res.send('no book exists');
                });
        });

};
