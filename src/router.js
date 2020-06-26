import weatherApi from './api/WeatherApi';
import honorSchedule from './actions/honorSchedule';
import setAway from './actions/setAway';
import resumeSchedules from './actions/resumeSchedules';
import { hold, stopHold } from './actions/roomHold';

export default function route(request, method) {
    if (method === 'get') {
        switch (request.action) {
            case 'temp':
                return weatherApi().getRecentHighTemperature();
            case 'honorSchedule':
                return honorSchedule();
            default:
                return 'No route found';
        }
    }
    if (method === 'post') {
        switch (request.action) {
            case 'away':
                return setAway(request.payload.name, request.payload.away);
            case 'redriveSchedule':
                return resumeSchedules();
            case 'hold':
                return hold(request.payload.room);
            case 'stopHold':
                return stopHold(request.payload.room);
            default:
                return 'No route found';
        }
    }
    return 'No route found';
}
