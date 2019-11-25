import honorSchedule from './actions/honorSchedule';
import setAway from './actions/setAway';
import setVacation from './actions/setVacation';
import resumeSchedules from './actions/resumeSchedules';

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
            case 'redriveSchedule':
                return resumeSchedules();
            default:
                return 'No route found';
        }
    }
    return 'No route found';
}
