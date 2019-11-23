import GetRequest from './models/GetRequest';
import IftttEvent from './models/IftttEvent';
import api from './api/IftttWebhookApi';

function onGet(e) {
    const request = new GetRequest(e);

    if (request.action === 'setTemp') {
        const event = new IftttEvent({
            roomName: request.roomName,
            temperature: request.temperature,
        });
        api.triggerEvent(event);
        return `Setting ${request.roomName} to ${request.temperature} temperature.`;
    }
    return 'test';
}

function onPost() {
    return 'test';
}

function onTimedExecution() {
    return 'test';
}

export { onGet, onPost, onTimedExecution };
