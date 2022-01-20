/**
 * @jest-environment node
 */
import { searchForAccountByUsername } from '../../dist';
import { config } from '../testClientConfig';

describe('searchForAccountByUsername', () => {
    it('should test successful response', async () => {
        expect.assertions(6);
        const data = await searchForAccountByUsername(
            config,
            `${process.env.TEST_USER_ACCOUNT_USERNAME}`
        );
        const { payload, status, message, codes } = data;
        const { account_id, username, integrator } = payload;
        expect(status).toEqual('Success');
        expect(message.length).toBe(0);
        expect(codes.length).toBe(0);
        expect(username).toBe(`${process.env.TEST_USER_ACCOUNT_USERNAME}`);
        expect(account_id).toBeTruthy();
        expect(integrator).toBe('qa');
    });

    it('should fail on unknown account id', async () => {
        expect.assertions(1);
        try {
            const data = await searchForAccountByUsername(
                config,
                'fakeusername@howyadoing.com'
            );
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(404);
        }
    });
});
