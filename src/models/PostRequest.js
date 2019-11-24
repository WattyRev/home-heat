import getEnv from '../env';

export default class PostRequest {
    constructor(requestData) {
        this.action = requestData.parameter.action;
        if (requestData.postData.type === 'application/json' && requestData.postData.contents) {
            this.payload = JSON.parse(requestData.postData.contents);
            const { passcode } = getEnv();
            if (this.payload.passcode !== passcode) {
                throw new Error(`Request made with invalid passcode: ${this.payload.passcode}`);
            }
        }
    }
}
