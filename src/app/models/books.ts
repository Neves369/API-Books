import mongoose from '../../database';

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
    ref: {
        type: String,
        require: true, 
    },
    capa: {
        type: String,
        require: false,
    },
    descricao: {
        type: String,
        require: true, 
    }

});



const Books = mongoose.model('Books', BooksSchema);

export default Books;