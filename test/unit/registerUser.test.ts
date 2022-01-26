/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { registerUser } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('registerUser', () => {
    afterEach(() => {
        mockedAxios.post.mockReset();
    });

    it('should test successful response', async () => {
        const expectedPayload = {
            status: 'Success',
            message: [],
            codes: [],
            payload: {
                account_id: 'ACCOUNT_ID_STRING',
                username: 'SOME_USERNAME',
                password: '',
                user_id: '',
                steam: {
                    user_id: '',
                },
                oculus: {
                    user_id: '',
                },
                email: {
                    email_id: 'EMAIL_ID_STRING',
                    address: 'SOME_EMAIL_ADDRESS',
                    email_types: ['primary_contact'],
                    is_verified: true,
                },
                first_name: '',
                last_name: '',
                full_name: '',
                street_address_1: '',
                street_address_2: '',
                street_address_3: '',
                city: '',
                state_province: '',
                country_iso: '',
                zip_postal_code: '',
            },
        };
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: expectedPayload,
        });
        const data = await registerUser(config, {
            username: 'SOME_USERNAME',
            email: {
                address: 'SOME_EMAIL_ADDRESS',
                requires_verification: false,
            },
        });
        expect(data).toEqual(expectedPayload);
    });

    it('should fail on invalid username', async () => {
        expect.assertions(1);
        try {
            // no need to mock axios as the method will check validation before request
            const data = await registerUser(config, {
                // @ts-ignore
                username: null,
                email: {
                    address: 'SOME_EMAIL_ADDRESS',
                    requires_verification: false,
                },
            });
        } catch (err) {
            expect(err.message).toBe('username missing');
        }
    });

    it('should fail when missing one of email | steam | oculus', async () => {
        expect.assertions(1);
        try {
            // no need to mock axios as the method will check validation before request
            const data = await registerUser(config, {
                // @ts-ignore
                username: 'SOME_USERNAME',
            });
        } catch (err) {
            expect(err.message).toBe(
                'must include one of (email | steam | oculus) identifiers'
            );
        }
    });
});
