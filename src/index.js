import GetRequest from './models/GetRequest';
import IftttEvent from './models/IftttEvent';
import IftttWebhookApi from './api/IftttWebhookApi';

function onGet(e) {
    const request = new GetRequest(e);

    if (request.action === 'setTemp') {
        const event = new IftttEvent({
            room: request.room,
            temperature: request.temperature,
        });
        IftttWebhookApi.triggerEvent(event);
        return `Setting ${request.room} to ${request.temperature} temperature.`;
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
