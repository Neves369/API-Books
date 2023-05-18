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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
function gerarToken(params = {}) {
    const secret = process.env.SECRET || 'default_secret_key';
    return jsonwebtoken_1.default.sign(params, secret);
}
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (yield user_1.default.findOne({ email })) {
            return res.status(400).send({ Erro: "Usuário já existe!" });
        }
        else {
            const user = yield user_1.default.create(req.body);
            user.senha = undefined;
            return res.send({ user, token: gerarToken({ id: user.id }) });
        }
    }
    catch (error) {
        return res.status(400).send({ Erro: 'Não foi possível criar novo usuário!' });
    }
}));
router.get('/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.headers;
    const user = yield user_1.default.findOne({ email }).select('+senha');
    if (!user) {
        return res.status(400).send({ Erro: 'Email e/ou senha incorreto(s)' });
    }
    if (senha && user.senha) {
        if (!(yield bcryptjs_1.default.compare(String(senha), user.senha))) {
            return res.status(400).send({ Erro: 'Senha incorreta!' });
        }
        else {
            user.senha = undefined;
            return res.send({ id: user._id, nome: user.nome, email: user.email, favoritos: user.favoritos, token: gerarToken({ id: user.id }) });
        }
    }
}));
exports.default = (app) => app.use('/auth', router);
