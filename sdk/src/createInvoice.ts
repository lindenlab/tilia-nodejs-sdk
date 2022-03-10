import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';
import { Invoice, InvoiceResponse } from './types';

export interface CreateInvoiceResponse {
    status: 'Success' | 'Failure';
    message: Array<string>;
    codes: Array<string>;
    payload: InvoiceResponse;
}

export const CREATE_INVOICE_SCOPES = ['write_invoices'];

/**
 * Creates a draft invoice. Once created, the invoice can be paid using the /pay endpoint.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {Invoice} invoice A valid invoice definition.
 *
 * @returns Promise with either success payload or error
 */
export const createInvoice = async (
    config: Configuration,
    invoice: Invoice
): Promise<CreateInvoiceResponse> => {
    if (!invoice) {
        return Promise.reject(
            new Error('createInvoice requires invoice argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(config, CREATE_INVOICE_SCOPES); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const url = `https://invoicing.${envBase}/v2/invoice`;
        const response = await axios.post(url, invoice, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });
        const { data } = response;
        if (response.status === 201 && data) {
            return data;
        } else {
            return Promise.reject(new Error('An unknown error occurred.')); // since Axios throws on non-2xx status codes and we expect 'data' on 2xx, this shouldn't be needed.  But, just to be safe...
        }
    } catch (err) {
        return Promise.reject(err);
    }
};
