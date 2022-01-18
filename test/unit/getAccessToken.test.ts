import axios from 'axios';
import { getAccessToken } from '../../dist';
import { config, invalidClientConfig } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getAccessToken', () => {
    afterEach(() => {
        mockedAxios.post.mockReset();
    });

    it('should test successful response', async () => {
        const expectedPayload = {
            access_token: 'SOME_LONG_STRING_VALUE_HERE',
            token_type: 'Bearer',
            expires_in: 3600,
            scope: 'write_registrations,write_user_tokens',
        };
        mockedAxios.post.mockResolvedValueOnce({ status: 200, data: expectedPayload });
        const data = await getAccessToken(config);
        expect(true).toEqual(true);
    });

    it('should test missing config argument', async () => {
        try {
            // @ts-ignore
            const data = await getAccessToken();
        } catch (err) {
            expect(err.message).toBe('getAccessToken requires a valid Configuration object.');
        }
    });

    it('should fail on unknown credentials', async () => {
        try {
            mockedAxios.post.mockRejectedValue({ response: { status: 400 } });
            const data = await getAccessToken(invalidClientConfig);
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(400);
        }
    });
});
