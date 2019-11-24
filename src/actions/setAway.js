import { status } from '../globals/Spreadsheet';
import { awayRooms } from '../constants/rooms';
import setTemp from './setTemp';
import log from '../util/log';

export default function setAway(isAway) {
    // If setting away to true, set all relevant rooms to away temperature
    if (isAway) {
        status.setAway(true);
        log('Leaving home');
        awayRooms.forEach(roomName => {
            setTemp(roomName, 'away');
        });
        return 'See you later!';
    }
    throw new Error('setAway(false) is not currently supported. use setVacation(false) instead.');
}
