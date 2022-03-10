/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authorizeUser } from '../../dist';
import { config } from '../testClientConfig';

describe('authorizeUser', () => {
    it('should test successful response', async () => {
        expect.assertions(5);
        const data = await authorizeUser(
            config,
            `${process.env.TEST_USER_ACCOUNT_ID}`
        );
        const { payload, status, message, codes } = data;
        const { token } = payload;
        expect(status).toEqual('Success');
        expect(message.length).toBe(0);
        expect(codes.length).toBe(0);
        expect(typeof token.access_token).toBe('string');
        expect(token.access_token.length).toBeGreaterThan(0);
    });

    it('should fail on unknown user id', async () => {
        expect.assertions(1);
        try {
            const data = await authorizeUser(
                config,
                '55555555-5555-5555-5555-555555555555'
            );
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(404);
        }
    });
});
