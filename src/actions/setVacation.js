import { getStatus } from '../globals/Spreadsheet';
import rooms from '../constants/rooms';
import setTemp from './setTemp';
import resumeSchedule from './resumeSchedule';
import log from '../util/log';

export default function setVacation(isVacation) {
    const status = getStatus();

    // If setting away to true, set all relevant rooms to away temperature
    if (isVacation) {
        log('Going on vacation');
        status.setVacation(true);
        rooms.forEach(roomName => {
            setTemp(roomName, 'away');
        });
        return 'Have a nice trip!';
    }

    // Set both away and vacation to false since I'm obviously neither away nor on vacation
    status.setAway(false);
    status.setVacation(false);
    log('Returning home');
    rooms.forEach(roomName => {
        resumeSchedule(roomName);
    });
    return 'Welcome home!';
}
