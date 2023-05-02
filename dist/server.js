"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const authController_1 = __importDefault(require("./app/controllers/authController"));
const userController_1 = __importDefault(require("./app/controllers/userController"));
const bookController_1 = __importDefault(require("./app/controllers/bookController"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('tiny'));
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.json({ type: 'application/vnd.api+json' }));
app.use((0, cors_1.default)());
(0, authController_1.default)(app);
(0, userController_1.default)(app);
(0, bookController_1.default)(app);
app.use((error, req, res, next) => {
    res.status(500).send(error.message);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Aplicação rodando na porta ", port);
});
exports.default = app;
