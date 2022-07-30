const mongoose = require('../../database');

const BooksSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    autor: {
        type: String,
        require: true,
    },
    arquivo: {
        type: String,
        require: true,
    },
    capa: {
        type: String,
        require: true, 
    },
    genero: {
        type: String,
        require: true, 
    }

});



const Books = mongoose.model('Books', BooksSchema);

module.exports = Books;