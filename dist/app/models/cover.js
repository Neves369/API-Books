"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const CoverSchema = new database_1.default.Schema({
    capa: {
        type: String,
        require: false,
    },
    descricao: {
        type: String,
        require: true,
    }
});
const Covers = database_1.default.model('covers', CoverSchema);
exports.default = Covers;
