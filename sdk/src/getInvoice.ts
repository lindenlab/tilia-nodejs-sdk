import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';
import { InvoiceResponse } from './types';

export interface GetInvoiceResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: InvoiceResponse;
}

export const GET_INVOICE_SCOPES = ['read_invoices'];

/**
 * Retrieves details for the invoice specified by the invoiceId parameter.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} invoiceId ID for existing invoice.
 *
 * @returns Promise with either success payload or error
 */
export const getInvoice = async (
    config: Configuration,
    invoiceId: string
): Promise<GetInvoiceResponse> => {
    if (!invoiceId) {
        return Promise.reject(
            new Error('getInvoice requires invoiceId argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(config, GET_INVOICE_SCOPES); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const url = `https://invoicing.${envBase}/v2/invoice/${invoiceId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });
        const { data } = response;
        if (response.status === 200 && data) {
            return data;
        } else {
            return Promise.reject(new Error('An unknown error occurred.')); // since Axios throws on non-2xx status codes and we expect 'data' on 2xx, this shouldn't be needed.  But, just to be safe...
        }
    } catch (err) {
        return Promise.reject(err);
    }
};
