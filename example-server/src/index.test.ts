import express from "express"; // import express
import { routes } from './routes'; //import file we are testing
import request from 'supertest'; // supertest is a framework that allows to easily test web apis

const app = express(); //an instance of an express app, a 'fake' express app

app.use("/", routes); //routes

describe("Routes", () => {
    it("tests getAccessToken", async () => {
        expect.assertions(4);
        const { body } = await request(app).get("/getAccessToken"); //uses the request function that calls on express app instance
        const { access_token, expires_in, scope, token_type } = body;
        expect(typeof access_token).toBe('string');
        expect(expires_in).toBe(3600);
        expect(scope).toBe('write_registrations,write_user_tokens');
        expect(token_type).toBe('Bearer');
    });
});