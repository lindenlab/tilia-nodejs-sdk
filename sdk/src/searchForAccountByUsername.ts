import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';
import { AccountProfile } from './types';

export interface SearchForAccountByUsernameResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: AccountProfile;
}

export const SEARCH_FOR_ACCOUNT_BY_USERNAME_SCOPES = ['search_accounts'];

/**
 * Searches for a user with the matching username and returns their account profile.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} username A valid username for a known user already registered to Tilia
 *
 * @returns Promise with either success payload or error
 */
export const searchForAccountByUsername = async (
    config: Configuration,
    username: string
): Promise<SearchForAccountByUsernameResponse> => {
    if (!username) {
        return Promise.reject(
            new Error('searchForAccountByUsername requires username argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(
            config,
            SEARCH_FOR_ACCOUNT_BY_USERNAME_SCOPES
        ); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        let url = `https://accounts.${envBase}/v1/user-info/search?username=${encodeURIComponent(
            username
        )}`;
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
