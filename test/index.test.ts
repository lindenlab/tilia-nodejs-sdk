/**
 * @jest-environment node
 */
import 'dotenv/config';
import { Configuration, getAccessToken, authorizeUser } from '../';

const config = new Configuration({
  clientId: `${process.env.CLIENT_ID}`,
  clientSecret: `${process.env.CLIENT_SECRET}`,
  envBase: 'staging.tilia-inc.com'
});

describe("getAccessToken", () => {
  it("should test successful response", async () => {
      expect.assertions(5);
      const data = await getAccessToken(config);
      const { access_token, expires_in, scope, token_type } = data;
      expect(typeof access_token).toBe('string');
      expect(access_token.length).toBeGreaterThan(0);
      expect(expires_in).toBe(3600);
      expect(scope).toBe('write_registrations,write_user_tokens');
      expect(token_type).toBe('Bearer');
  });

  it("should fail on unknown credentials", async () => {
    expect.assertions(1);
    try {
      const data = await getAccessToken({
        clientId: '55555555-5555-5555-5555-555555555555',
        clientSecret: '55555555-5555-5555-5555-555555555555',
        envBase: 'staging.tilia-inc.com'
      });
    } catch (err) {
      const { response } = err;
      expect(response.status).toEqual(400);
    }
  });
});

describe("authorizeUser", () => {
  it("should test successful response", async () => {
    expect.assertions(5);
    const data = await authorizeUser(config, `${process.env.TEST_USER_ACCOUNT_ID}`);
    const { payload, status, message, codes } = data;
    const { password_token } = payload;
    expect(status).toEqual('Success');
    expect(message.length).toBe(0);
    expect(codes.length).toBe(0);
    expect(typeof password_token).toBe('string');
    expect(password_token.length).toBeGreaterThan(0);
  });

  it("should fail on unknown user id", async () => {
    expect.assertions(1);
    try {
      const data = await authorizeUser(config, '55555555-5555-5555-5555-555555555555');
    } catch (err) {
      const { response } = err;
      expect(response.status).toEqual(404);
    }
  });
});