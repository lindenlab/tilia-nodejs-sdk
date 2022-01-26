import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';

export interface PaymentMethod {
    id: string;
    account_id: string;
    method_class: string;
    display_string: string;
    provider: string;
    psp_reference: string;
    psp_hash_code: string;
    integrator: string;
    created: string;
    updated: string;
    payment_method_id: string;
}

export interface PaymentCard extends PaymentMethod {
    first_name: string;
    last_name: string;
    full_name: string;
    expiration: string;
    address1: string;
    city: string;
    country_iso: string;
    geoip_state: string;
    geoip_country_iso: string;
    zip: string;
    bin: string;
    last_four: string;
    avs: string;
}

export interface PayPal extends PaymentMethod {
    first_name: string;
    last_name: string;
    full_name: string;
    psp_provided_email: string;
    email_id: string;
    address1: string;
    city: string;
    state: string;
    country_iso: string;
    geoip_state: string;
    geoip_country_iso: string;
    zip: string;
    address_verified: number;
}

export interface Wallet extends PaymentMethod {
    wallet_balance: string;
    provider_data: {
        wallet_id: string;
        wallet_balance: string;
        balance: string;
    };
}

export interface GetPaymentMethodsResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: Array<PaymentCard | PayPal | Wallet>;
}

export const GET_PAYMENT_METHODS_SCOPES = ['read_payment_methods'];

/**
 * Retrieves payment methods for the supplied accountId.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} accountId A valid account ID for a known user already registered to Tilia
 *
 * @returns Promise with either success payload or error
 */
export const getPaymentMethods = async (
    config: Configuration,
    accountId: string
): Promise<GetPaymentMethodsResponse> => {
    if (!accountId) {
        return Promise.reject(
            new Error('getPaymentMethods requires accountId argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(
            config,
            GET_PAYMENT_METHODS_SCOPES
        ); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const url = `https://payments.${envBase}/${accountId}/payment_methods`;
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
