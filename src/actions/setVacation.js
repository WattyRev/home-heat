import spreadsheetApi from '../api/SpreadsheetApi';
import rooms from '../constants/rooms';
import setTemp from './setTemp';
import resumeSchedule from './resumeSchedule';
import log from '../util/log';

export default function setVacation(isVacation) {
    // If setting away to true, set all relevant rooms to away temperature
    if (isVacation) {
        log('Going on vacation');
        spreadsheetApi.setIsVacation(true);
        rooms.forEach(roomName => {
            setTemp(roomName, 'away');
        });
        return 'Have a nice trip!';
    }

    // Set both away and vacation to false since I'm obviously neither away nor on vacation
    spreadsheetApi.setIsAway(false);
    spreadsheetApi.setIsVacation(false);
    log('Returning home');
    rooms.forEach(roomName => {
        resumeSchedule(roomName);
    });
    return 'Welcome home!';
}
