import { transformGetRequest } from './models/GetRequest';
import IftttEvent from './models/IftttEvent';
import IftttWebhookApi from './api/IftttWebhookApi';

function onGet(e) {
    const request = transformGetRequest(e);

    if (request.get('action') === 'setTemp') {
        const event = new IftttEvent({
            room: request.get('room'),
            temperature: request.get('temperature'),
        });
        IftttWebhookApi.triggerEvent(event);
        return `Setting ${request.get('room')} to ${request.get('temperature')} temperature.`;
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
