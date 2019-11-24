import moment from 'moment';
import honorSchedule from './actions/honorSchedule';

export default function route(request) {
    switch (request.action) {
        case 'honorSchedule':
            return honorSchedule();
        case 'testTime':
            return moment().format();
        default:
            return 'No route found';
    }
}
