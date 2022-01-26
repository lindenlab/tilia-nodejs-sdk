# Tilia NodeJS SDK

## Getting Started

```bash
npm install tilia-nodejs-sdk # this will not work until we are live on npm
```

## Example using Express

```typescript
import express, { Request, Response } from "express";
import { Configuration, Environment, authorizeUser } from 'tilia-nodejs-sdk';

const PORT = 7000;
const app = express();
app.use(express.json());

const config = new Configuration({
    clientId: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.CLIENT_SECRET}`,
    envBase: Environment.Staging,
});

app.get("/authorize-user", async (req: Request, res: Response) => {
    try {
        const data = await authorizeUser(
            config,
            "ACCOUNT_ID_OF_USER"
        );
        res.status(200).send(data);
    } catch (e) {
        const errMsg = (e as Error).message || "Unknown error";
        res.status(500).send({ "message": errMsg });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
```

## Local testing
A .env file is required for local testing with
```
CLIENT_ID=TEST_CLIENT_ID
CLIENT_SECRET=TEST_CLIENT_SECRET
TEST_USER_ACCOUNT_ID=TEST_KNOWN_USER_ACCOUNT_ID
TEST_USER_ACCOUNT_USERNAME=TEST_USER_ACCOUNT_USERNAME
TEST_BUYER_WITH_PAYMENT_METHODS_ACCOUNT_ID=TEST_BUYER_WITH_PAYMENT_METHODS_ACCOUNT_ID
TEST_BUYER_USD_WALLET_ID=TEST_BUYER_USD_WALLET_ID
```