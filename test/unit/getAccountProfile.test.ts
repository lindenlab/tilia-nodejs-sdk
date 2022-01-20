import axios from 'axios';
import { getAccountProfile } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAccountProfile', () => {
    afterEach(() => {
        mockedAxios.post.mockReset();
        mockedAxios.get.mockReset();
    });

    it('should succeed with valid inputs', async () => {
        const expectedPayload = {
            status: 'Success',
            message: [],
            codes: [],
            payload: {
                account_id: `${process.env.TEST_USER_ACCOUNT_ID}`,
                username: 'SOME_USERNAME',
                email: 'SOME_EMAIL',
                is_blocked: false,
                integrator: 'qa',
                created: 'SOME_DATE_STRING',
            },
        };
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: { access_token: 'SOME_LONG_TOKEN_STRING' },
        });
        mockedAxios.get.mockResolvedValue({
            status: 200,
            data: expectedPayload,
        });
        const data = await getAccountProfile(
            config,
            `${process.env.TEST_USER_ACCOUNT_ID}`
        );
        expect(data).toEqual(expectedPayload);
    });

    it('should fail on missing config', async () => {
        try {
            const data = await getAccountProfile(
                // @ts-ignore
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
            const data = await getAccountProfile(config);
        } catch (err) {
            expect(err.message).toBe(
                'getAccountProfile requires accountId argument.'
            );
        }
    });

    it('should fail on unknown user id', async () => {
        expect.assertions(1);
        try {
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { access_token: 'SOME_LONG_TOKEN_STRING' },
            });
            mockedAxios.get.mockRejectedValue({ response: { status: 404 } });
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
