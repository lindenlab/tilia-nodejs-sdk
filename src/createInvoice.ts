import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';

export interface Metadata {
    [key: string]: any;
}

export interface LineItem {
    amount: number;
    currency: string;
    transaction_type: string;
    product_sku: string;
    reference_type?: string;
    reference_id?: string;
    description?: string;
    metadata?: Metadata | null;
}

export interface InvoicePaymentMethod {
    payment_method_id: string;
    amount?: number;
}

export interface Invoice {
    account_id: string;
    reference_type?: string;
    reference_id?: string;
    description?: string;
    metadata?: Metadata | null;
    payment_methods: Array<InvoicePaymentMethod>;
    line_items: Array<LineItem>;
}

export interface SubItemResponse {
    subitem_id: string;
    amount: number;
    currency: string;
    display_amount: string;
    reference_type: string;
    reference_id: string;
    subitem_type: string;
    description: string;
    metadata: { [key: string]: any } | null;
    source_account_id: string;
    source_payment_method_id: string;
    source_wallet_id: string;
    destination_account_id: string;
    destination_payment_method_id: string;
    destination_wallet_id: string;
}

export interface PaymentMethodResponse {
    payment_method_id: string;
    authorized_amount: number;
    currency: string;
    display_amount: string;
    subitems: { [id: string]: SubItemResponse };
}

export interface LineItemResponse {
    line_item_id: string;
    product_sku: string;
    amount: number;
    currency: string;
    display_amount: string;
    reference_type: string;
    reference_id: string;
    transaction_type: string;
    description: string;
    metadata: Metadata | null;
    subitems: {};
}

export interface SummaryResponse {
    total_amount: number;
    currency: string;
    display_amount: string;
}

export interface InvoiceResponse {
    invoice_id: string;
    account_id: string;
    invoice_type: string;
    reference_type: string;
    reference_id: string;
    state: 'OPEN' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELED';
    description: string;
    metadata: Metadata | null;
    summary: SummaryResponse;
    failure_reason: string;
    created: string;
    updated: string;
    payment_methods: { [id: string]: PaymentMethodResponse };
    line_items: { [id: string]: LineItemResponse };
    subitems: {};
}

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
