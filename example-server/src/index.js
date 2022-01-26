"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
// import cors from "cors";
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = require("./routes");
const error_middleware_1 = require("./middleware/error.middleware");
const not_found_middleware_1 = require("./middleware/not-found.middleware");
const PORT = 7000;
const HOST = '0.0.0.0';
const app = (0, express_1.default)();
/**
 *  App Configuration
 */
app.use((0, helmet_1.default)());
// app.use(cors());
app.use(express_1.default.json());
app.use('/', routes_1.routes);
app.use(error_middleware_1.errorHandler);
app.use(not_found_middleware_1.notFoundHandler);
/**
 * Server Activation
 */
app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});
