export default class IftttEvent {
    constructor(data) {
        this.roomName = data.roomName;
        this.temperature = data.temperature;
    }

    get name() {
        return `set_${this.roomName}_temp_${this.temperature}`;
    }
}
