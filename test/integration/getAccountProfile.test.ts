/**
 * @jest-environment node
 */
import { getAccountProfile } from '../../dist';
import { config } from '../testClientConfig';

describe('getAccountProfile', () => {
    it('should test successful response', async () => {
        expect.assertions(6);
        const data = await getAccountProfile(
            config,
            `${process.env.TEST_USER_ACCOUNT_ID}`
        );
        const { payload, status, message, codes } = data;
        const { account_id, username, integrator } = payload;
        expect(status).toEqual('Success');
        expect(message.length).toBe(0);
        expect(codes.length).toBe(0);
        expect(account_id).toBe(`${process.env.TEST_USER_ACCOUNT_ID}`);
        expect(username).toBeTruthy();
        expect(integrator).toBe('qa');
    });

    it('should fail on unknown account id', async () => {
        expect.assertions(1);
        try {
            const data = await getAccountProfile(
                config,
                '55555555-5555-5555-5555-555555555555'
            );
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(404);
        }
    });
});
