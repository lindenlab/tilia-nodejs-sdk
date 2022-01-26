/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { searchForAccountByUsername } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('searchForAccountByUsername', () => {
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
                account_id: 'SOME_ACCOUNT_ID',
                username: `${process.env.TEST_USER_ACCOUNT_USERNAME}`,
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
        const data = await searchForAccountByUsername(
            config,
            `${process.env.TEST_USER_ACCOUNT_USERNAME}`
        );
        expect(data).toEqual(expectedPayload);
    });

    it('should fail on missing config', async () => {
        try {
            const data = await searchForAccountByUsername(
                // @ts-ignore
                null,
                `${process.env.TEST_USER_ACCOUNT_USERNAME}`
            );
        } catch (err) {
            expect(err.message).toBe(
                'getAccessToken requires a valid Configuration object.'
            );
        }
    });

    it('should fail on missing username', async () => {
        try {
            // @ts-ignore
            const data = await searchForAccountByUsername(config);
        } catch (err) {
            expect(err.message).toBe(
                'searchForAccountByUsername requires username argument.'
            );
        }
    });

    it('should fail on unknown username', async () => {
        expect.assertions(1);
        try {
            mockedAxios.post.mockResolvedValue({
                status: 200,
                data: { access_token: 'SOME_LONG_TOKEN_STRING' },
            });
            mockedAxios.get.mockRejectedValue({ response: { status: 404 } });
            const data = await searchForAccountByUsername(
                config,
                'somefakeusername@heythere.com'
            );
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(404);
        }
    });
});
