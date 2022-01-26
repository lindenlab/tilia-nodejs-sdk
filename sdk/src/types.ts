export interface AccountProfile {
    account_id: string;
    username: string;
    email: string;
    is_blocked: boolean;
    integrator: string;
    created: string;
}

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
