/**
 * @jest-environment node
 */
import { registerUser } from '../../dist';
import { config } from '../testClientConfig';

describe('registerUser', () => {
    const username = `register-user-test-${Date.now()}`;
    const email = `${username}@lindenlab.com`;
    const user = {
        username: username,
        email: {
            address: email,
            requires_verification: false,
        },
    };

    it('should succeed with valid inputs', async () => {
        expect.assertions(7);
        const data = await registerUser(config, user);
        const { payload, status, message, codes } = data;
        expect(status).toEqual('Success');
        expect(message.length).toBe(0);
        expect(codes.length).toBe(0);
        expect(typeof payload.account_id).toBe('string');
        expect(payload.account_id.length).toBeGreaterThan(0);
        expect(payload.username).toBe(username);
        expect(payload.email.address).toBe(email);
    });

    it('should fail when trying to register an existing user, but still return that user info', async () => {
        expect.assertions(5);
        try {
            const data = await registerUser(config, user); // registering same user as previous test
        } catch (err) {
            const { response } = err;
            const { payload, status } = response.data;
            expect(response.status).toEqual(409);
            expect(status).toEqual('Failure');
            expect(payload.account_id.length).toBeGreaterThan(0);
            expect(payload.username).toBe(username);
            expect(payload.email.address).toBe(email);
        }
    });
});
