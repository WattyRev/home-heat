import GetRequest from './models/GetRequest';
import route from './router';

function onGet(e) {
    const request = new GetRequest(e);
    return route(request);
}

function onPost() {
    return 'test';
}

function onTimedExecution() {
    return 'test';
}

export { onGet, onPost, onTimedExecution };
