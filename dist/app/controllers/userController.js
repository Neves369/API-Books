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
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.use(auth_1.default);
// Retorna as informações de todos livros e suas respectivas capas 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        return res.send(users);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ erro: 'Não foi possível recuperar os usuários' });
    }
}));
// Retorna as informações de um usuário por id 
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.userId) {
            return res.status(400).send({ erro: 'Informe o usuário' });
        }
        let user = yield user_1.default.findOne({ "_id": `${req.params.userId}` });
        return res.send(user);
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível recuperar usuário' });
    }
}));
router.put('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.userId) {
            return res.status(400).send({ erro: 'Informe o usuário' });
        }
        const id = req.params.userId;
        const user = req.body;
        const response = yield user_1.default.findByIdAndUpdate({ "_id": `${id}` }, user);
        return res.send(user);
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível atualizar o usuário' });
    }
}));
// Essa rota por hora não vai ser usada (Futuramente haverá permissões especiais para podermos utilizá-la)
router.delete('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.findByIdAndRemove(req.params.userId);
        return res.send("Usuário deletado com sucesso!");
    }
    catch (error) {
        return res.status(400).send({ erro: 'Não foi possível deletar o usuário' });
    }
}));
exports.default = (app) => app.use('/user', router);
