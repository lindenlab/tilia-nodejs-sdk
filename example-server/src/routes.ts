require("dotenv").config({ path: "../sdk/.env" });
import express, { Request, Response } from "express";
import {
  Configuration,
  Environment,
  getAccountProfile,
  registerUser,
  UserInfoInput,
  authorizeUser,
  getPaymentMethods,
  authorizeInvoice,
  AuthorizeInvoice,
} from "tilia-nodejs-sdk";

const config = new Configuration({
  clientId: `${process.env.CLIENT_ID}`,
  clientSecret: `${process.env.CLIENT_SECRET}`,
  envBase: Environment.Staging,
});

export const routes = express.Router();

routes.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Hello world");
});

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
routes.post("/register-user", async (req: Request, res: Response) => {
  try {
    const payload = req.body as UserInfoInput;
    const data = await registerUser(config, payload);
    res.status(200).send(data);
  } catch (e: any) {
    const errMsg = e?.message || "Unknown error";
    const statusCode = e?.response?.status || 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});

/*
Example:
    curl --location --request POST 'http://localhost:7000/get-account-profile' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "account_id": "ACCOUNT_ID_STRING"
    }'
*/
routes.post("/get-account-profile", async (req: Request, res: Response) => {
  try {
    const data = await getAccountProfile(config, req.body.account_id as string);
    res.status(200).send(data);
  } catch (e: any) {
    const errMsg = e?.message || "Unknown error";
    const statusCode = e?.response?.status || 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});

/*
Example:
    curl --location --request POST 'http://0.0.0.0:7000/get-user-token' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "account_id": "USER_TILIA_ACCOUNT_ID"
    }'
*/
routes.post("/get-user-token", async (req: Request, res: Response) => {
  try {
    const data = await authorizeUser(config, req.body.account_id as string);
    res.status(200).send(data);
  } catch (e: any) {
    const errMsg = e?.message || "Unknown error";
    const statusCode = e?.response?.status || 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});

/*
Example:
  curl --location --request POST 'http://0.0.0.0:7000/get-account-profile' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "account_id": "USER_TILIA_ACCOUNT_ID"
  }'
*/
routes.post("/get-payment-methods", async (req: Request, res: Response) => {
  try {
    const data = await getPaymentMethods(config, req.body.account_id as string);
    res.status(200).send(data);
  } catch (e: any) {
    const errMsg = e?.message || "Unknown error";
    const statusCode = e?.response?.status || 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});

/*
Example:
  curl --location --request POST 'http://0.0.0.0:7000/authorize-invoice' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "account_id": "PAYER_TILIA_ACCOUNT_ID",
      "is_escrow": false,
      "invoice_mechanism": "widget",
      "reference_type": "MY_REFERENCE_TYPE_STRING",
      "reference_id": "MY_REFERENCE_ID_STRING",
      "line_items": [
          {
            "description": "ITEM_DESCRIPTION",
            "product_sku": "ITEM_SKU",
            "transaction_type": "user_to_user",
            "currency": "CURRENCY_CODE",
            "amount": 1,
            "recipients": [
              {
                "amount": 1,
                "currency": "CURRENCY_CODE",
                "destination_wallet_id": "PAYEE_WALLET_ID"
              }
            ]
          }
      ]
  }'
*/
routes.post("/authorize-invoice", async (req: Request, res: Response) => {
  try {
    const data = await authorizeInvoice(config, req.body as AuthorizeInvoice);
    res.status(200).send(data);
  } catch (e: any) {
    const errMsg = e?.message || "Unknown error";
    const statusCode = e?.response?.status || 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});
