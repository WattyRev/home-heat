import { getScriptProperties } from '../globals/PropertiesService';

export default class PostRequest {
    constructor(requestData) {
        this.action = requestData.parameter.action;
        if (
            requestData.postData &&
            requestData.postData.type === 'application/json' &&
            requestData.postData.contents
        ) {
            this.payload = JSON.parse(requestData.postData.contents);
            const { passcode } = getScriptProperties();
            if (this.payload.passcode !== passcode) {
                throw new Error(`Request made with invalid passcode: ${this.payload.passcode}`);
            }
        }
    }
}
