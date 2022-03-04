import express from "express"; // import express
import bodyParser from "body-parser";
import { routes } from "./routes"; //import file we are testing
import request from "supertest"; // supertest is a framework that allows to easily test web apis

const app = express(); //an instance of an express app, a 'fake' express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", routes); //routes

/**
 * This set of tests is just meant to check a basic happy path
 * integration.  It is by no means an exhaustive test of the underlying
 * api calls.
 * Please refer to the Tilia Documentation for more info: https://www.tilia.io/docs/
 */
describe("Routes", () => {
  it("should successfuly call register-user", async () => {
    expect.assertions(3);
    const email = `test-register-user+${Date.now()}@lindenlab.com`;
    const newUser = {
      username: email,
      email: {
        address: email,
        requires_verification: false,
      },
    };
    const { body } = await request(app)
      .post("/register-user")
      .send(newUser)
      .set("Accept", "application/json");
    const { status, payload } = body;
    const { account_id, username } = payload;
    expect(status).toBe("Success");
    expect(account_id.length).toBe(36);
    expect(username).toBe(email);
  });

  it("should successfuly call get-account-profile", async () => {
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

  it("should successfuly call get-user-token", async () => {
    expect.assertions(4);
    const { body } = await request(app)
      .post("/get-user-token")
      .send({ account_id: `${process.env.TEST_USER_ACCOUNT_ID}` })
      .set('Accept', 'application/json');
    const { status, payload } = body;
    const { access_token, token_type } = payload.token;
    expect(status).toBe('Success');
    expect(typeof access_token).toBe('string');
    expect(access_token.length).toBeGreaterThan(0);
    expect(token_type).toBe('Bearer');
  });

  it("should successfuly call get-payment-methods", async () => {
    expect.assertions(3);
    const { body } = await request(app)
      .post("/get-payment-methods")
      .send({ account_id: `${process.env.TEST_USER_ACCOUNT_ID}` })
      .set("Accept", "application/json");
    const { status, payload } = body;
    expect(status).toBe("Success");
    expect(payload.length).toBeGreaterThan(0);
    expect(Object.keys(payload[0]).sort()).toEqual([
      "account_id",
      "created",
      "display_string",
      "id",
      "integrator",
      "method_class",
      "payment_method_id",
      "pm_state",
      "processing_currency",
      "provider",
      "provider_data",
      "psp_hash_code",
      "psp_reference",
      "tags",
      "updated",
      "wallet_balance",
    ]);
  });

  it("should successfuly call authorize-invoice", async () => {
    const invoice = {
      account_id: "1021c252-8ba4-449f-92b4-8aeba85b29f8",
      is_escrow: false,
      invoice_mechanism: "widget",
      reference_type: "Upland order",
      reference_id: "4112KM95",
      line_items: [
        {
          description: "Some fee",
          product_sku: "blah blah sku",
          transaction_type: "user_to_integrator",
          currency: "USD",
          amount: 1,
        },
      ],
    };
    expect.assertions(4);
    const { body } = await request(app)
      .post("/authorize-invoice")
      .send(invoice)
      .set("Accept", "application/json");
    const { status, payload } = body;
    const { nonce_auth_id, authorized_invoice_id, redirect } = payload;
    expect(status).toBe("Success");
    expect(nonce_auth_id.length).toBe(36);
    expect(authorized_invoice_id.length).toBe(36);
    expect(redirect.includes(authorized_invoice_id) && redirect.includes(nonce_auth_id)).toBe(true);
  });
});
