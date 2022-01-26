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
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const tilia_nodejs_sdk_1 = require("tilia-nodejs-sdk");
const config = new tilia_nodejs_sdk_1.Configuration({
    clientId: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.CLIENT_SECRET}`,
    envBase: tilia_nodejs_sdk_1.Environment.Staging,
});
exports.routes = express_1.default.Router();
exports.routes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("Hello world");
}));
/*
Example:
    curl --location --request POST 'http://0.0.0.0:7000/register-user' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "username": "user+1643084610344@lindenlab.com",
        "email": {
            "address": "user+1643084610344@lindenlab.com",
            "requires_verification": false
        }
    }'
*/
exports.routes.post("/register-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const data = yield (0, tilia_nodejs_sdk_1.registerUser)(config, payload);
        res.status(200).send(data);
    }
    catch (e) {
        const errMsg = e.message || "Unknown error";
        const statusCode = 
        // @ts-ignore
        e && e.response && e.response.status ? e.response.status : 500;
        res.status(statusCode).send({ status: "error", message: errMsg });
    }
}));
/*
Example:
    curl --location --request POST 'http://localhost:7000/get-account-profile' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "account_id": "ACCOUNT_ID_STRING"
    }'
*/
exports.routes.post("/get-account-profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.account_id) {
            throw new Error("Missing account_id in request");
        }
        const data = yield (0, tilia_nodejs_sdk_1.getAccountProfile)(config, req.body.account_id);
        res.status(200).send(data);
    }
    catch (e) {
        const errMsg = e.message || "Unknown error";
        const statusCode = 
        // @ts-ignore
        e && e.response && e.response.status ? e.response.status : 500;
        res.status(statusCode).send({ status: "error", message: errMsg });
    }
}));
/*
Example:
    curl --location --request POST 'http://0.0.0.0:7000/get-user-token' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "account_id": "USER_TILIA_ACCOUNT_ID"
    }'
*/
exports.routes.post("/get-user-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.account_id) {
            throw new Error("Missing account_id in request");
        }
        const data = yield (0, tilia_nodejs_sdk_1.authorizeUser)(config, req.body.account_id);
        res.status(200).send(data);
    }
    catch (e) {
        const errMsg = e.message || "Unknown error";
        const statusCode = 
        // @ts-ignore
        e && e.response && e.response.status ? e.response.status : 500;
        res.status(statusCode).send({ status: "error", message: errMsg });
    }
}));
/*
Example:

*/
exports.routes.post("/get-payment-methods", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.account_id) {
            throw new Error("Missing account_id in request");
        }
        const data = yield (0, tilia_nodejs_sdk_1.getPaymentMethods)(config, req.body.account_id);
        res.status(200).send(data);
    }
    catch (e) {
        const errMsg = e.message || "Unknown error";
        const statusCode = 
        // @ts-ignore
        e && e.response && e.response.status ? e.response.status : 500;
        res.status(statusCode).send({ status: "error", message: errMsg });
    }
}));
