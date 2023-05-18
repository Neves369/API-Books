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
const convertArrayToString_1 = __importDefault(require("../../util/convertArrayToString"));
const generateHeaderAWS_1 = require("../../util/generateHeaderAWS");
const router = express_1.default.Router();
router.use(auth_1.default);
// Retorna uma lista de livros com suas respectivas capas 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let books = [];
        // Busca todos os livros de uma determinada categoria
        if (req.headers.categoria) {
            if (req.headers.categoria == "ALL") {
                books = yield books_1.default.find();
            }
            else {
                books = yield books_1.default.find({ genero: { $in: req.headers.categoria } });
            }
        }
        // Busca 3 livros de cada categoria informada
        if (req.headers.categorias) {
            let categorias = (0, convertArrayToString_1.default)(String(req.headers.categorias));
            books = yield books_1.default.aggregate([
                { $match: { genero: { $in: categorias } } },
                { $unwind: "$genero" },
                { $match: { genero: { $in: categorias } } },
                { $group: { _id: "$genero", books: { $push: "$$ROOT" } } },
                { $project: { _id: 0, genero: "$_id", books: { $slice: ["$books", 3] } } },
                { $limit: 3 * categorias.length }
            ]);
        }
        // Busca os livros listados no array de favoritos
        if (req.headers.favoritos) {
            let favoritos = (0, convertArrayToString_1.default)(String(req.headers.favoritos));
            books = yield books_1.default.find({ "_id": { $in: favoritos } });
        }
        return res.send(books);
    }
    catch (error) {
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
// Recebe o livro e o salva no banco de dados (precisa terminar)
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield books_1.default.create(req.body);
        return res.send({ book });
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível submeter o livro' });
    }
}));
// Atualiza um livro (precisa terminar)
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
// Recebe a referencia de um livro e retorna a autorização para baixá-lo
router.put('/auth/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ref = req.headers.ref;
        let remove = "https://litterae.s3.sa-east-1.amazonaws.com";
        ref = ref.replace(new RegExp(remove, 'g'), "");
        let auth = (0, generateHeaderAWS_1.generateAWSAuthHeader)(ref);
        return res.send(auth);
    }
    catch (error) {
        return res.status(400).send({ erro: 'Erro ao autorizar transação' });
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
