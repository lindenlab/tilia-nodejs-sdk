import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';

export interface AuthorizeInvoiceRecipient {
    amount: number;
    currency: string;
    destination_wallet_id: string;
}

export interface AuthorizeInvoiceLineItem {
    transaction_type: string; // 'user_to_user' | 'user_to_integrator'
    currency: string;
    amount: number;
    description?: string;
    product_sku?: string;
    recipients?: Array<AuthorizeInvoiceRecipient>;
}

export interface AuthorizeInvoice {
    account_id: string;
    is_escrow: boolean;
    invoice_mechanism: string; // 'direct' | 'widget' | 'email' | 'sms' | 'qrcode'
    line_items: Array<AuthorizeInvoiceLineItem>;
    reference_type?: string;
    reference_id?: string;
}

export interface AuthorizeInvoiceResponse {
    status: 'Success' | 'Failure';
    message: Array<string>;
    codes: Array<string>;
    payload: {
        line_items_payload_id: string;
        redirect: string;
    };
}

export const AUTHORIZE_INVOICE_SCOPES = ['write_user_tokens', 'write_invoices'];

/**
 * Creates an authorized invoice which can be used to allow the 'payee' to complete payment through the 'Tramsaction Page'
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {AuthorizeInvoice} invoice A valid authorized invoice definition.
 *
 * @returns Promise with either success payload or error
 */
export const authorizeInvoice = async (
    config: Configuration,
    invoice: AuthorizeInvoice
): Promise<AuthorizeInvoiceResponse> => {
    if (!invoice) {
        return Promise.reject(
            new Error('authorizeInvoice requires invoice argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(
            config,
            AUTHORIZE_INVOICE_SCOPES
        ); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const url = `https://invoicing.${envBase}/v2/authorize/invoice`;
        const response = await axios.post(url, invoice, {
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
