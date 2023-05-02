"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("../models/books"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const convertArrayToString_1 = require("src/util/convertArrayToString");
const router = express_1.default.Router();
router.use(auth_1.default);
// Retorna uma lista de livros com suas respectivas capas 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let books = [];
        console.log(req);
        // Busca todos os livros de uma determinada categoria
        if (req.headers.categoria) {
            books = yield books_1.default.find({ genero: { $in: req.headers.categoria } });
        }
        // Busca 3 livros de cada categoria informada
        if (req.headers.categorias) {
            let categorias = (0, convertArrayToString_1.converter)(String(req.headers.categorias));
            books = yield books_1.default.aggregate([
                { $match: { genero: { $in: categorias } } },
                { $unwind: "$genero" },
                { $match: { genero: { $in: categorias } } },
                { $group: { _id: "$genero", books: { $push: "$$ROOT" } } },
                { $project: { _id: 0, genero: "$_id", books: { $slice: ["$books", 3] } } },
                { $limit: 3 * categorias.length }
            ]);
        }
        // Busca os livros listados no array de favoritos, caso a quantidade não seja informada busca todos
        if (req.headers.favoritos) {
            console.log("favoritos: ", req.query);
            if (req.query.favoritos == '') {
                books = yield books_1.default.find({ "_id": { $in: req.headers.favoritos } });
            }
            else {
                books = yield books_1.default.find({ "_id": { $in: req.headers.favoritos } });
            }
        }
        // books.forEach((book) => {
        //     let teste = fs.readFileSync(`./books/${book.ref}/capa.png`, {encoding: 'base64'})
        //     book.capa = teste;
        // });
        return res.send(books);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ erro: 'Não foi possível recuperar os livros' });
    }
}));
// Retorna as informações de um livro por id 
router.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let book = yield books_1.default.findOne({ "_id": `${req.params.bookId}` });
        return res.send({ book });
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível recuperar o livro' });
    }
}));
// Retorna o epub do livro por id (A referencia é o nome da pasta onde estão os arquivos) 
router.get('/data/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let book = yield books_1.default.findOne({ "_id": `${req.params.bookId}` });
        if (!book) {
            return res.status(404).send('Livro não encontrado');
        }
        let data = fs_1.default.readFileSync(`./books/${book.ref}/data.epub`, { encoding: 'base64' });
        return res.send(data);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ erro: 'Não foi possível recuperar o livro' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield books_1.default.create(req.body);
        return res.send({ book });
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível submeter o livro' });
    }
}));
router.put('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = req.body;
        const response = yield books_1.default.findByIdAndUpdate({ "_id": `${id}` }, book);
        return res.send({ book });
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível atualizar o livro' });
    }
}));
// Essa rota por hora não vai ser usada (Futuramente haverá permissões especiais para podermos utilizá-la)
router.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield books_1.default.findByIdAndRemove(req.params.bookId);
        return res.send("livro deletado");
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível deletar o livro' });
    }
}));
exports.default = (app) => app.use('/books', router);
