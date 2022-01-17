export class Configuration {
    clientId: string;
    clientSecret: string;
    envBase: string;

    constructor(data: { clientId: string, clientSecret: string, envBase: string }) {
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.envBase = data.envBase;
    }
}