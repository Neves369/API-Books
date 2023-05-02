"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.DATABASE_URL || "DEFAULT_VALUE";
const options = { useNewUrlParser: true, useUnifiedTopology: true };
try {
    mongoose_1.default.connect(url, options);
}
catch (e) {
    console.log(e);
}
mongoose_1.default.Promise = global.Promise;
exports.default = mongoose_1.default;
