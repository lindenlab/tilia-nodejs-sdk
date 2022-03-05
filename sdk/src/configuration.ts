export class Configuration {
    /**
     * Defines client credentials and environment info.
     * @param {String} clientId
     * @param {String} clientSecret
     * @param {String} envBase Like staging.tilia-inc.com or tilia-inc.com.  This will be pre-fixed with api is needed, and post-fixed with path, etc
     */
    clientId: string;
    clientSecret: string;
    envBase: string;

    constructor(data: {
        clientId: string;
        clientSecret: string;
        envBase: string;
    }) {
        if (typeof global !== 'object') {
            throw new Error(
                'This package should only be run on a server, it is not meant for the browser.'
            );
        }
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.envBase = data.envBase;
    }
}
