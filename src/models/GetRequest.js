export default class GetRequest {
    constructor(requestData) {
        this.action = requestData.parameter.action;
        this.room = requestData.parameter.room;
        this.temperature = requestData.parameter.temperature;
    }
}
