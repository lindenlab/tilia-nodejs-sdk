import axios from 'axios';
import { getPaymentMethods } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getPaymentMethods', () => {
    afterEach(() => {
        mockedAxios.post.mockReset();
        mockedAxios.get.mockReset();
    });

    it('should succeed with valid inputs', async () => {
        const expectedPayload = {
            status: 'Success',
            message: [],
            codes: [],
            payload: [
                {
                    id: 'SOME_LONG_ID_1',
                    account_id: 'SOME_LONG_STRING',
                    method_class: 'registration',
                    display_string: 'Default USD Wallet',
                    provider: 'wallet',
                    psp_reference: 'SOME_LONG_STRING',
                    psp_hash_code: '',
                    processing_currency: 'USD',
                    pm_state: 'ACTIVE',
                    integrator: 'qa',
                    created: '2021-11-29 21:38:28',
                    updated: '2021-11-29 21:38:28',
                    tags: null,
                    wallet_balance: '0',
                    payment_method_id: '',
                    provider_data: {
                        wallet_id: 'SOME_LONG_STRING',
                        wallet_balance: '0',
                        balance: 0,
                    },
                },
                {
                    id: 'SOME_LONG_ID_2',
                    account_id: 'SOME_LONG_STRING',
                    method_class: 'convertible',
                    display_string: 'Convertible QAD wallet',
                    provider: 'wallet',
                    psp_reference: 'SOME_LONG_STRING',
                    psp_hash_code: '',
                    processing_currency: 'QAD',
                    pm_state: 'ACTIVE',
                    integrator: 'qa',
                    created: '2021-11-29 21:38:28',
                    updated: '2021-11-29 21:38:28',
                    tags: null,
                    wallet_balance: '0',
                    payment_method_id: '',
                    provider_data: {
                        wallet_id: 'SOME_LONG_STRING',
                        wallet_balance: '0',
                        balance: 0,
                    },
                },
                {
                    id: 'SOME_LONG_ID_3',
                    account_id: 'SOME_LONG_STRING',
                    method_class: 'standard',
                    display_string: 'Standard QAD wallet',
                    provider: 'wallet',
                    psp_reference: 'SOME_LONG_STRING',
                    psp_hash_code: '',
                    processing_currency: 'QAD',
                    pm_state: 'ACTIVE',
                    integrator: 'qa',
                    created: '2021-11-29 21:38:28',
                    updated: '2021-11-29 21:38:28',
                    tags: null,
                    wallet_balance: '0',
                    payment_method_id: '',
                    provider_data: {
                        wallet_id: 'SOME_LONG_STRING',
                        wallet_balance: '0',
                        balance: 0,
                    },
                },
            ],
        };
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: { access_token: 'SOME_LONG_TOKEN_STRING' },
        });
        mockedAxios.get.mockResolvedValue({
            status: 200,
            data: expectedPayload,
        });
        const data = await getPaymentMethods(
            config,
            `${process.env.TEST_USER_ACCOUNT_ID}`
        );
        expect(data).toEqual(expectedPayload);
    });

    it('should fail on missing accountId', async () => {
        try {
            // @ts-ignore
            const data = await getPaymentMethods(config);
        } catch (err) {
            expect(err.message).toBe(
                'getPaymentMethods requires accountId argument.'
            );
        }
    });

    it('should look like it succeeds on unknown account id, but contain empty list', async () => {
        const expectedPayload = {
            status: 'Success',
            message: [],
            codes: [],
            payload: [],
        };
        mockedAxios.post.mockResolvedValue({
            status: 200,
            data: { access_token: 'SOME_LONG_TOKEN_STRING' },
        });
        mockedAxios.get.mockResolvedValue({
            status: 200,
            data: expectedPayload,
        });
        const data = await getPaymentMethods(
            config,
            '55555555-5555-5555-5555-555555555555'
        );
        expect(data).toEqual(expectedPayload);
    });
});
