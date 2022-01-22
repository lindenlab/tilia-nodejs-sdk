/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authorizeInvoice } from '../../dist';
import { config } from '../testClientConfig';

/**
 * These are just basic happy/sad path tests, and not meant to
 * test all variations of authorize invoice creation and failures.
 */

describe('authorizeInvoice', () => {
    it('should succeed with valid invoice info', async () => {
        expect.assertions(5);
        const invoice = {
            account_id: '1021c252-8ba4-449f-92b4-8aeba85b29f8',
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
                            destination_wallet_id:
                                '0f6a66df-f5ed-4a00-bfc4-4d2ff465f555',
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
                            destination_wallet_id:
                                '0f6a66df-f5ed-4a00-bfc4-4d2ff465f556',
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
        const data = await authorizeInvoice(config, invoice);
        const { payload, status } = data;
        const { line_items_payload_id, redirect } = payload;
        expect(status).toEqual('Success');
        expect(typeof line_items_payload_id).toBe('string');
        expect(line_items_payload_id.length).toBeGreaterThan(0);
        expect(typeof redirect).toBe('string');
        expect(redirect.length).toBeGreaterThan(0);
    });

    it('should fail on invalid account/pm ID', async () => {
        expect.assertions(2);
        const invoice = {
            account_id: '55555555-5555-5555-5555-555555555555',
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
                            destination_wallet_id:
                                '55555555-5555-5555-5555-555555555556',
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
                            destination_wallet_id:
                                '55555555-5555-5555-5555-555555555557',
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
        try {
            const data = await authorizeInvoice(config, invoice);
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(500);
            expect(response.data).toEqual({
                status: 'Failure',
                message: ['encountered an unexpected error'],
                codes: ['SERVER_ERROR'],
                payload: null,
            });
        }
    });
});
