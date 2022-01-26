require('dotenv').config()
import express from "express";
// import cors from "cors";
import helmet from "helmet";
import { routes } from './routes';
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

const PORT = 7000;
const HOST = '0.0.0.0';

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
// app.use(cors());
app.use(express.json());
app.use('/', routes);

app.use(errorHandler);
app.use(notFoundHandler);

/**
 * Server Activation
 */

app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});