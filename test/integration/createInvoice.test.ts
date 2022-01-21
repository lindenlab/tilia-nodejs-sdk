/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createInvoice } from '../../dist';
import { config } from '../testClientConfig';

/**
 * These are just basic happy/sad path tests, and not meant to
 * test all variations of invoice creation and failures.
 */

describe('createInvoice', () => {
    it('should succeed with valid invoice info', async () => {
        expect.assertions(3);
        const invoice = {
            account_id: `${process.env.TEST_BUYER_WITH_PAYMENT_METHODS_ACCOUNT_ID}`,
            invoice_type: 'user_purchase',
            payment_methods: [
                {
                    payment_method_id: `${process.env.TEST_BUYER_USD_WALLET_ID}`,
                },
            ],
            line_items: [
                {
                    amount: 1,
                    currency: 'USD',
                    description: 'neat hat',
                    transaction_type: 'user_to_integrator',
                    product_sku: 'sku_123',
                    reference_type: 'Acme catalog ID',
                    reference_id: '7245480',
                    metadata: { myMetadataKey: 'my metadata value' },
                },
            ],
        };
        const data = await createInvoice(config, invoice);
        const { payload, status } = data;
        const { account_id, payment_methods } = payload;
        expect(status).toEqual('Success');
        expect(account_id).toBe(
            `${process.env.TEST_BUYER_WITH_PAYMENT_METHODS_ACCOUNT_ID}`
        );
        expect(payment_methods).toHaveProperty(
            `${process.env.TEST_BUYER_USD_WALLET_ID}`
        );
    });

    it('should fail on invalid account/pm ID', async () => {
        expect.assertions(2);
        const invoice = {
            account_id: '55555555-5555-5555-5555-555555555555',
            invoice_type: 'user_purchase',
            payment_methods: [
                {
                    payment_method_id: '55555555-5555-5555-5555-555555555555',
                },
            ],
            line_items: [
                {
                    amount: 1,
                    currency: 'USD',
                    description: 'neat hat',
                    transaction_type: 'user_to_integrator',
                    product_sku: 'sku_123',
                    reference_type: 'Acme catalog ID',
                    reference_id: '7245480',
                    metadata: { myMetadataKey: 'my metadata value' },
                },
            ],
        };
        try {
            // @ts-ignore
            const data = await createInvoice(config, invoice);
        } catch (err) {
            const { response } = err;
            expect(response.status).toEqual(400);
            expect(response.data.payload.error).toBe(
                'resource request invalid: failed to get pmid (55555555-5555-5555-5555-555555555555). the request is invalid'
            );
        }
    });
});
