import express, { Request, Response } from "express";
import { type } from "os";
import {
  Configuration,
  Environment,
  getAccountProfile,
  registerUser,
  UserInfoInput,
  authorizeUser,
  getPaymentMethods
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
  } catch (e) {
    const errMsg = (e as Error).message || "Unknown error";
    const statusCode =
      // @ts-ignore
      e && e.response && e.response.status ? e.response.status : 500;
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
    if (!req.body.account_id) {
      throw new Error("Missing account_id in request");
    }
    const data = await getAccountProfile(config, req.body.account_id as string);
    res.status(200).send(data);
  } catch (e) {
    const errMsg = (e as Error).message || "Unknown error";
    const statusCode =
      // @ts-ignore
      e && e.response && e.response.status ? e.response.status : 500;
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
    if (!req.body.account_id) {
      throw new Error("Missing account_id in request");
    }
    const data = await authorizeUser(config, req.body.account_id as string);
    res.status(200).send(data);
  } catch (e) {
    const errMsg = (e as Error).message || "Unknown error";
    const statusCode =
      // @ts-ignore
      e && e.response && e.response.status ? e.response.status : 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});

/*
Example:

*/
routes.post("/get-payment-methods", async (req: Request, res: Response) => {
  try {
    if (!req.body.account_id) {
      throw new Error("Missing account_id in request");
    }
    const data = await getPaymentMethods(config, req.body.account_id as string);
    res.status(200).send(data);
  } catch (e) {
    const errMsg = (e as Error).message || "Unknown error";
    const statusCode =
      // @ts-ignore
      e && e.response && e.response.status ? e.response.status : 500;
    res.status(statusCode).send({ status: "error", message: errMsg });
  }
});
