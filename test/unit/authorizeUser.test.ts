import axios from 'axios';
import { authorizeUser } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authorizeUser', () => {
    afterEach(() => {
        mockedAxios.post.mockReset();
    });

    it('should test successful response', async () => {
        const expectedPayload = {
            status: 'Success',
            message: [],
            codes: [],
            payload: {
                password_token: 'SOME_LONG_STRING_VALUE',
            },
        };
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: expectedPayload,
        });
        const data = await authorizeUser(
            config,
            `${process.env.TEST_USER_ACCOUNT_ID}`
        );
        const { payload, status, message, codes } = data;
        const { password_token } = payload;
        expect(status).toEqual('Success');
        expect(message.length).toBe(0);
        expect(codes.length).toBe(0);
        expect(typeof password_token).toBe('string');
        expect(password_token.length).toBeGreaterThan(0);
    });

    it('should fail on missing config', async () => {
        try {
            // @ts-ignore
            const data = await authorizeUser(
                null,
                `${process.env.TEST_USER_ACCOUNT_ID}`
            );
        } catch (err) {
            expect(err.message).toBe(
                'getAccessToken requires a valid Configuration object.'
            );
        }
    });

    it('should fail on missing accountId', async () => {
        try {
            // @ts-ignore
            const data = await authorizeUser(config);
        } catch (err) {
            expect(err.message).toBe(
                'authorizeUser requires accountId argument.'
            );
        }
    });

    it('should fail on unknown user id', async () => {
        expect.assertions(1);
        try {
            mockedAxios.post.mockRejectedValue({ response: { status: 404 } });
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
