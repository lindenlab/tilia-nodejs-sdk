import axios from 'axios';
import { Configuration } from './configuration';
import { getAccessToken } from './getAccessToken';

export interface UserInfoInput {
    username: string;
    email?: {
        address: string;
        requires_verification: boolean;
    };
    steam?: {
        user_id: string;
    };
    oculus?: {
        user_id: string;
    };
    full_name?: string;
    street_address_1?: string;
    street_address_2?: string;
    street_address_3?: string;
    city?: string;
    state_province?: string;
    country?: string;
    zip_postal_code?: string;
}

export interface UserInfoPayload {
    account_id: string;
    username: string;
    password: string;
    user_id: string;
    steam: {
        user_id: string;
    };
    oculus: {
        user_id: string;
    };
    email: {
        email_id: string;
        address: string;
        email_types: Array<string>;
        is_verified: boolean;
    };
    first_name: string;
    last_name: string;
    full_name: string;
    street_address_1: string;
    street_address_2: string;
    street_address_3: string;
    city: string;
    state_province: string;
    country_iso: string;
    zip_postal_code: string;
}

export interface RegisterUserResponse {
    status: string;
    message: Array<string>;
    codes: Array<string>;
    payload: UserInfoPayload;
}

export const REGISTER_USER_SCOPES = ['write_registrations'];

const validateUserInfo = (userInfo: UserInfoInput): Array<string> => {
    let errorMsgs = [];
    const { username, email, steam, oculus } = userInfo;
    if (!username) {
        errorMsgs.push('username missing');
    }
    const includesEmail = email && email.address;
    const includesSteam = steam && steam.user_id;
    const includesOculus = oculus && oculus.user_id;
    if (!includesEmail && !includesSteam && !includesOculus) {
        errorMsgs.push(
            'must include one of (email | steam | oculus) identifiers'
        );
    }
    const identifierCount =
        (includesEmail ? 1 : 0) +
        (includesSteam ? 1 : 0) +
        (includesOculus ? 1 : 0); // we should only receive one of these
    if (identifierCount > 1) {
        errorMsgs.push(
            'must include ONLY one of (email | steam | oculus) supplied'
        );
    }
    return errorMsgs;
};

/**
 * Retrieves a password token for a validated user that can be used
 * in other api calls.
 * @param {Configuration} config A valid Configuration object that includes client id/secret and env info
 * @param {UserInfoInput} userInfo User info that must include a username and one of email | steam | oculus identifier
 *
 * @returns Promise with either success payload or error
 */
export const registerUser = async (
    config: Configuration,
    userInfo: UserInfoInput
): Promise<RegisterUserResponse> => {
    const userInfoErrMsgs = validateUserInfo(userInfo);
    if (userInfoErrMsgs.length > 0) {
        return Promise.reject(new Error(userInfoErrMsgs.join(', ')));
    }
    try {
        const ccTokenData = await getAccessToken(config, REGISTER_USER_SCOPES); // get integrator client access token
        const { access_token } = ccTokenData;
        const { envBase } = config;
        let url = `https://accounts.${envBase}/register`;
        const response = await axios.post(url, userInfo, {
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
