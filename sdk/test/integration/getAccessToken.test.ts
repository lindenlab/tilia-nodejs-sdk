/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAccessToken } from '../../dist';
import { config, invalidClientConfig } from '../testClientConfig';

describe('getAccessToken', () => {
    it('should test successful response', async () => {
        expect.assertions(5);
        try {
            const data = await getAccessToken(config, [
                'write_registrations',
                'write_user_tokens',
            ]);
            const { access_token, expires_in, scope, token_type } = data;
            expect(typeof access_token).toBe('string');
            expect(access_token.length).toBeGreaterThan(0);
            expect(expires_in).toBe(3600);
            expect(scope).toBe('write_registrations,write_user_tokens');
            expect(token_type).toBe('Bearer');
        } catch (err) {
            console.error('err:', err);
        }
    });

    it('should fail on unknown credentials', async () => {
        expect.assertions(1);
        try {
            const data = await getAccessToken(invalidClientConfig, [
                'write_registrations',
                'write_user_tokens',
            ]);
        } catch (err) {
            // @ts-ignore
            const { response } = err;
            expect(response.status).toEqual(400);
        }
    });
});
