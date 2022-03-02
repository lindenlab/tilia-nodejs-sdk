/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { authorizeInvoice } from '../../dist';
import { config } from '../testClientConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authorizeInvoice', () => {
    afterEach(() => {
        mockedAxios.post.mockReset();
        mockedAxios.get.mockReset();
    });

    it('should succeed with valid inputs', async () => {
        const invoice = {
            account_id: 'SOME_LONG_STRING',
            is_escrow: false,
            invoice_mechanism: 'widget',
            reference_type: 'Upland order',
            reference_id: '4112KM95',
            line_items: [
                {
                    description: '4911 East Plat Ave',
                    product_sku: 'Fresno, CA',
                    transaction_type: 'user_to_user',
                    currency: 'USD',
                    amount: 1024,
                    recipients: [
                        {
                            amount: 1024,
                            currency: 'USD',
                            destination_wallet_id: 'SOME_LONG_STRING',
                        },
                    ],
                },
                {
                    description: '4155 West 31st St',
                    product_sku: 'New York, NY',
                    transaction_type: 'user_to_user',
                    currency: 'USD',
                    amount: 2351,
                    recipients: [
                        {
                            amount: 2351,
                            currency: 'USD',
                            destination_wallet_id: 'SOME_LONG_STRING',
                        },
                    ],
                },
                {
                    description: 'Transaction fee',
                    product_sku: '5% of transaction total',
                    transaction_type: 'user_to_integrator',
                    currency: 'USD',
                    amount: 169,
                },
            ],
        };
        const expectedPayload = {
            status: 'Success',
            message: [],
            codes: [],
            payload: {
                authorized_invoice_id: 'd2cf9330-1dc5-4e3b-8c23-7fac10f4e0e7',
                redirect:
                    'https://web.staging.tilia-inc.com/ui/appauth/3b7a031e-af4a-46f3-ac3a-eaa816e95572?authorized_invoice_id=d2cf9330-1dc5-4e3b-8c23-7fac10f4e0e7&escrow=false&integrator=qa',
            },
        };
        mockedAxios.post.mockImplementation(url => {
            if (url.includes('/token')) {
                return Promise.resolve({
                    status: 200,
                    data: { access_token: 'SOME_LONG_TOKEN_STRING' },
                });
            }
            return Promise.resolve({
                status: 200,
                data: expectedPayload,
            });
        });
        const data = await authorizeInvoice(config, invoice);
        expect(data).toEqual(expectedPayload);
    });

    it('should fail on missing invoice', async () => {
        try {
            // @ts-ignore
            const data = await authorizeInvoice(config);
        } catch (err) {
            const { response } = err;
            expect(err.message).toBe(
                'authorizeInvoice requires invoice argument.'
            );
        }
    });
});
