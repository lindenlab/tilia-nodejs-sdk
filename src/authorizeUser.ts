import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from '.';

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