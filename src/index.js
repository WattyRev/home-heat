import GetRequest from './models/GetRequest';
import PostRequest from './models/PostRequest';
import honorSchedule from './actions/honorSchedule';
import route from './router';

function onGet(e) {
    const request = new GetRequest(e);
    return route(request, 'get');
}

function onPost(e) {
    const request = new PostRequest(e);
    return route(request, 'post');
}

function onTimedExecution() {
    return honorSchedule();
}

export { onGet, onPost, onTimedExecution };
