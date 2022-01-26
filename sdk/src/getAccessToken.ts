import axios from 'axios';
import { Configuration } from './configuration';

export interface GetAccessTokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

/**
 * While typescript would catch most of the issues that
 * would be found in the validation check, it's possible a
 * user will use this package without typescript.
 * Adding a check for 'undefined' as well as I ran across
 * an issue with a missing process.env.CLIENT_ID could resolve
 * in getting a string with 'undefined' as the value.
 */
const isValidConfig = (config: Configuration) => {
    return (
        !!config &&
        config.clientId &&
        config.clientId !== 'undefined' && // a missing environment variable could get passed in as undefined
        config.clientSecret &&
        config.clientSecret !== 'undefined' && // a missing environment variable could get passed in as undefined
        config.envBase
    );
};

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
    if (!isValidConfig(config)) {
        return Promise.reject(
            new Error('getAccessToken requires a valid Configuration object.')
        );
    }
    if (!scopes || scopes.length === 0) {
        return Promise.reject(
            new Error(
                'getAccessToken requires an array of scopes to use in request.'
            )
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
        const url = `https://auth.${envBase}/token`;
        const response = await axios.post(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            params,
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
