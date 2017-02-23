const mongoose = require('mongooes');
const Book = require('../dataModel/bookModel')

exports.search = (args) => {
    let words = args.split(' ');
    let re = new RegExp(str);
    let result = words.map((str) => {
        Book.find({
            '$or': [
                {'title': re},
                {'author': re}
            ]
        });
    });
    return result;
}
