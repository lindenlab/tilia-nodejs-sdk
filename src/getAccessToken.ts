import axios from 'axios';
import { Configuration } from './configuration';
import { URL, URLSearchParams } from 'url';

export interface GetAccessTokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

/**
 * Retrieves an access token based on the client ID/Secret
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {Array.<String>} scopes List of access scopes to use in request.
 */
export const getAccessToken = async (
    config: Configuration,
    scopes: Array<string>
): Promise<GetAccessTokenResponse> => {
    // validation check
    if (
        !config ||
        !config.clientId ||
        !config.clientSecret ||
        !config.envBase
    ) {
        return Promise.reject(
            new Error('getAccessToken requires a valid Configuration object.')
        );
    }
    if (!scopes || scopes.length === 0) {
        return Promise.reject(
            new Error('getAccessToken requires an array of scopes to use in request.')
        );
    }
    try {
        const GRANT_TYPE = 'client_credentials';
        const { envBase, clientId, clientSecret } = config;
        const params = {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: GRANT_TYPE,
            scope: scopes.join(','),
        };
        let url = new URL(`https://auth.${envBase}/token`);
        url.search = new URLSearchParams(params).toString();
        const response = await axios.post(url.toString());
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
