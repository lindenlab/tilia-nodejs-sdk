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
const express_1 = __importDefault(require("express")); // import express
const routes_1 = require("./routes"); //import file we are testing
const supertest_1 = __importDefault(require("supertest")); // supertest is a framework that allows to easily test web apis
const app = (0, express_1.default)(); //an instance of an express app, a 'fake' express app
app.use("/", routes_1.routes); //routes
describe("Routes", () => {
    it("tests getAccessToken", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(4);
        const { body } = yield (0, supertest_1.default)(app).get("/getAccessToken"); //uses the request function that calls on express app instance
        const { access_token, expires_in, scope, token_type } = body;
        expect(typeof access_token).toBe('string');
        expect(expires_in).toBe(3600);
        expect(scope).toBe('write_registrations,write_user_tokens');
        expect(token_type).toBe('Bearer');
    }));
});
