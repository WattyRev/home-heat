import honorSchedule from './actions/honorSchedule';
import setAway from './actions/setAway';
import setVacation from './actions/setVacation';

export default function route(request, method) {
    if (method === 'get') {
        switch (request.action) {
            case 'honorSchedule':
                return honorSchedule();
            default:
                return 'No route found';
        }
    }
    if (method === 'post') {
        switch (request.action) {
            case 'vacation':
                return setVacation(request.payload.vacation === 'true');
            case 'away':
                return setAway(request.payload.away === 'true');
            default:
                return 'No route found';
        }
    }
    return 'No route found';
}
