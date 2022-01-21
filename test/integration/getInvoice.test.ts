/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getInvoice, createInvoice } from '../../dist';
import { config } from '../testClientConfig';

describe('getInvoice', () => {
    it('should succeed with valid inputs', async () => {
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
        const createInvoiceResponse = await createInvoice(config, invoice);
        const { payload: createInvoicePayload } = createInvoiceResponse;
        const data = await getInvoice(
            config,
            createInvoicePayload.invoice_id

        );
        const { payload, status } = data;
        const { invoice_id, account_id } = payload;
        expect(status).toEqual('Success');
        expect(invoice_id).toBe(createInvoicePayload.invoice_id);
        expect(account_id).toBe(createInvoicePayload.account_id);
    });

    it('should fail on unknown invoice id', async () => {
        expect.assertions(2);
        try {
            const data = await getInvoice(
                config,
                '55555555-5555-5555-5555-555555555555'
            );
        } catch (err) {
            const { response } = err;
            expect(response.data.codes).toEqual(expect.arrayContaining(['INVOICE_NOT_FOUND']));
            expect(response.status).toEqual(404);
        }
    });
});
