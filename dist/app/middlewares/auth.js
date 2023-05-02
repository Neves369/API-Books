"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.permitir;
    if (!authHeader) {
        return res.status(401).send({ erro: "Token não informado " });
    }
    const parts = authHeader.split(" ");
    if (!(parts.length === 2)) {
        return res.status(401).send({ erro: "Erro no Token" });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ erro: "Token com formato inválido" });
    }
    const secret = process.env.SECRET ? process.env.SECRET : '';
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err)
            return res.status(401).send({ erro: "Token inválido" });
        req.userId = decoded.id;
        return next();
    });
};
exports.default = authMiddleware;
