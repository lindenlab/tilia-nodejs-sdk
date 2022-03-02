import 'dotenv/config';
import express from "express"; // import express
import bodyParser from 'body-parser';
import { routes } from "./routes"; //import file we are testing
import request from "supertest"; // supertest is a framework that allows to easily test web apis

const app = express(); //an instance of an express app, a 'fake' express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", routes); //routes

describe("Routes", () => {
  it("tests get-account-profile", async () => {
    expect.assertions(2);
    const { body } = await request(app)
      .post("/get-account-profile")
      .send({ account_id: `${process.env.TEST_USER_ACCOUNT_ID}` })
      .set('Accept', 'application/json');
    const { status, payload } = body;
    const { account_id, expires_in, scope, token_type } = payload;
    expect(status).toBe('Success');
    expect(account_id).toBe(process.env.TEST_USER_ACCOUNT_ID);
  });
});
