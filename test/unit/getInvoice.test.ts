/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { getInvoice } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getInvoice', () => {
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
                invoice_id: 'SOME_LONG_STRING',
                account_id: 'SOME_LONG_STRING',
                invoice_type: 'user_purchase',
                reference_type: '',
                reference_id: '',
                state: 'OPEN',
                description: '',
                metadata: null,
                summary: {
                    total_amount: 1,
                    currency: 'USD',
                    display_amount: 'USD 0.01',
                },
                failure_reason: '',
                created: '0001-01-01T00:00:00Z',
                updated: '0001-01-01T00:00:00Z',
                payment_methods: {
                    SOME_LONG_STRING: {
                        payment_method_id: 'SOME_LONG_STRING',
                        authorized_amount: 1,
                        currency: 'USD',
                        display_amount: 'USD 0.01',
                        subitems: {
                            SOME_LONG_STRING: {
                                subitem_id: 'SOME_LONG_STRING',
                                amount: 0,
                                currency: 'USD',
                                display_amount: 'USD 0.00',
                                reference_type: '',
                                reference_id: '',
                                subitem_type: 'payment',
                                description: '',
                                metadata: {},
                                source_account_id: 'SOME_LONG_STRING',
                                source_payment_method_id: 'SOME_LONG_STRING',
                                source_wallet_id: 'SOME_LONG_STRING',
                                destination_account_id: 'SOME_LONG_STRING',
                                destination_payment_method_id: '',
                                destination_wallet_id: 'SOME_LONG_STRING',
                            },
                        },
                    },
                },
                line_items: {
                    SOME_LONG_STRING: {
                        line_item_id: 'SOME_LONG_STRING',
                        product_sku: 'sku_123',
                        amount: 1,
                        currency: 'USD',
                        display_amount: 'USD 0.01',
                        reference_type: 'Acme catalog ID',
                        reference_id: '7245480',
                        transaction_type: 'user_to_integrator',
                        description: 'neat hat',
                        metadata: {
                            myTest: 'my test value',
                        },
                        subitems: {},
                    },
                },
                subitems: {},
            },
        };
        mockedAxios.post.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: { access_token: 'SOME_LONG_TOKEN_STRING' },
            });
        });
        mockedAxios.get.mockImplementation(() => {
            return Promise.resolve({
                status: 200,
                data: expectedPayload,
            });
        });
        const data = await getInvoice(config, 'VALID_INVOICE_ID');
        expect(data).toEqual(expectedPayload);
    });

    it('should fail on unknown invoice id', async () => {
        expect.assertions(2);
        const expectedPayload = {
            status: 'Failure',
            message: [''],
            codes: ['INVOICE_NOT_FOUND'],
            payload: 'invoice_id not found',
        };
        try {
            mockedAxios.post.mockImplementation(() => {
                return Promise.resolve({
                    status: 200,
                    data: { access_token: 'SOME_LONG_TOKEN_STRING' },
                });
            });
            mockedAxios.post.mockImplementation(() => {
                return Promise.reject({
                    response: {
                        status: 404,
                        data: expectedPayload,
                    },
                });
            });
            const data = await getInvoice(
                config,
                '55555555-5555-5555-5555-555555555555'
            );
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(404);
            expect(response.data).toEqual(expectedPayload);
        }
    });
});
