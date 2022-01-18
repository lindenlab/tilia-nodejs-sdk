import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from '.';

/**
 * Retrieves a password token for a validated user that can be used
 * in other api calls.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {String} accountId A valid account ID for a known user already registered to Tilia
*/
export const authorizeUser = async (
    config: Configuration,
    accountId: string
): Promise<{
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: {
        password_token: string;
    };
}> => {
    if (!accountId) {
        return Promise.reject(new Error('authorizeUser requires accountId argument.'));
    }
    try {
        const ccTokenData = await getAccessToken(config); // get integrator client access token
        const { access_token } = ccTokenData;
        const SCOPES = [
            'user_info',
            'read_payment_method',
            'write_payment_method',
            'read_kyc',
            'verify_kyc',
        ];
        const { envBase } = config;
        const params = {
            account_id: accountId,
            return_password_token: true,
            scope: SCOPES.join(','),
        };
        let url = `https://auth.${envBase}/authorize/user`;
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
