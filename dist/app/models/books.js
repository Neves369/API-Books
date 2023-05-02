"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const BooksSchema = new database_1.default.Schema({
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
const Books = database_1.default.model('Books', BooksSchema);
exports.default = Books;
