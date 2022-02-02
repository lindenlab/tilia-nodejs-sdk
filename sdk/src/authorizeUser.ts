import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';

export interface AuthorizeUserResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: {
        token: {
            access_token: string;
            token_type: string;
            refresh_token: string;
            expiry: string;
        };
    };
}

export const AUTHORIZE_USER_SCOPES = ['write_user_tokens'];

/**
 * Retrieves a password token for a validated user that can be used
 * to perform actions on that user in other api calls.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} accountId A valid account ID for a known user already registered to Tilia
 */
export const authorizeUser = async (
    config: Configuration,
    accountId: string
): Promise<AuthorizeUserResponse> => {
    if (!accountId) {
        return Promise.reject(
            new Error('authorizeUser requires accountId argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(config, AUTHORIZE_USER_SCOPES); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const params = {
            account_id: accountId,
            return_token: true
        };
        const url = `https://auth.${envBase}/authorize/user`;
        const response = await axios.post(url, params, {
            headers: {
                Authorization: `Bearer ${access_token}`,
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
