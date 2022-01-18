import 'dotenv/config';
import { Configuration, Environment } from '../';

export const config = new Configuration({
    clientId: `${process.env.CLIENT_ID}`,
    clientSecret: `${process.env.CLIENT_SECRET}`,
    envBase: Environment.Staging,
});

export const invalidClientConfig = new Configuration({
    clientId: '55555555-5555-5555-5555-555555555555',
    clientSecret: '55555555-5555-5555-5555-555555555555',
    envBase: Environment.Staging,
});