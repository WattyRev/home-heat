export default class GetRequest {
    constructor(requestData) {
        this.action = requestData.parameter.action;
        this.roomName = requestData.parameter.roomName;
        this.temperature = requestData.parameter.temperature;
    }
}
