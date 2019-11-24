import GetRequest from './models/GetRequest';
import PostRequest from './models/PostRequest';
import honorSchedule from './actions/honorSchedule';
import log from './util/log';
import route from './router';

function onGet(e) {
    return errorInterceptor(() => {
        const request = new GetRequest(e);
        return route(request, 'get');
    });
}

function onPost(e) {
    return errorInterceptor(() => {
        const request = new PostRequest(e);
        return route(request, 'post');
    });
}

function onTimedExecution() {
    return errorInterceptor(honorSchedule);
}

function errorInterceptor(callback) {
    try {
        return callback();
    } catch (error) {
        log('Error', error.message);
        throw error;
    }
}

export { onGet, onPost, onTimedExecution };
