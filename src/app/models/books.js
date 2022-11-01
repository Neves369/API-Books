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
    genero: {
        type: Array,
        require: true,
    },
    linguagem: {
        type: String,
        require: true,
    },
    nota: {
        type: Number,
        require: true,
    },
    numeroPaginas: {
        type: Number,
        require: true,
    },
    rank: {
        type: Number,
        require: true,
    },
    ref_capa: {
        type: String,
        require: true, 
    },
    capa: {
        type: String,
        require: false,
    },
    ref_data: {
        type: String,
        require: true, 
    },
    descricao: {
        type: String,
        require: true, 
    }

});



const Books = mongoose.model('Books', BooksSchema);

module.exports = Books;