import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';
import { InvoiceResponse } from './types';

export interface PayInvoiceResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: InvoiceResponse;
}

export const PAY_INVOICE_SCOPES = ['write_invoices'];

/**
 * Processes the specified invoice for payment.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} invoiceId ID for existing invoice.
 *
 * @returns Promise with either success payload or error
 */
export const payInvoice = async (
    config: Configuration,
    invoiceId: string
): Promise<PayInvoiceResponse> => {
    if (!invoiceId) {
        return Promise.reject(
            new Error('payInvoice requires invoiceId argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(config, PAY_INVOICE_SCOPES); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const url = `https://invoicing.${envBase}/v2/invoice/${invoiceId}/pay`;
        const response = await axios.post(url, null, {
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
