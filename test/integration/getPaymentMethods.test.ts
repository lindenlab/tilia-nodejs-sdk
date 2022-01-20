/**
 * @jest-environment node
 */
import { getPaymentMethods } from '../../dist';
import { config } from '../testClientConfig';

describe('getPaymentMethods', () => {
    it('should test successful response', async () => {
        expect.assertions(2);
        const data = await getPaymentMethods(
            config,
            `${process.env.TEST_USER_ACCOUNT_ID}`
        );
        const { payload, status, message, codes } = data;
        expect(status).toEqual('Success');
        expect(payload instanceof Array).toBe(true);
    });

    it('should fail on unknown account id, but instead hands back empty payment list as success', async () => {
        expect.assertions(2);
        try {
            const data = await getPaymentMethods(
                config,
                '55555555-5555-5555-5555-555555555555'
            );
            const { payload, status, message, codes } = data;
            expect(status).toEqual('Success');
            expect(payload.length).toBe(0);
        } catch (err) {
            const { response } = err;
            //  expect(response.status).toBe(400);
        }
    });
});
