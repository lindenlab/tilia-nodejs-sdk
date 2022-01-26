import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';
import { AccountProfile } from './types';

export interface GetAccountProfileResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: AccountProfile;
}

export const GET_ACCOUNT_PROFILE_SCOPES = ['search_accounts'];

/**
 * Retrieves account profile for the user with the supplied accountId.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} accountId A valid account ID for a known user already registered to Tilia
 *
 * @returns Promise with either success payload or error
 */
export const getAccountProfile = async (
    config: Configuration,
    accountId: string
): Promise<GetAccountProfileResponse> => {
    if (!accountId) {
        return Promise.reject(
            new Error('getAccountProfile requires accountId argument.')
        );
    }
    try {
        const ccTokenData = await getAccessToken(
            config,
            GET_ACCOUNT_PROFILE_SCOPES
        ); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        const url = `https://accounts.${envBase}/v1/user-info/${accountId}`;
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
