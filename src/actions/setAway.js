import spreadsheetApi from '../api/SpreadsheetApi';
import { spencerRooms, michaelRooms, commonRooms } from '../constants/rooms';
import { resumeSchedule } from './resumeSchedules';
import setTemp from './setTemp';
import log from '../util/log';

export default function setAway(name, isAway) {
    // If setting away to true, set all relevant rooms to away temperature
    if (isAway) {
        log(`${name} leaving home`);

        // Set relevant rooms to away
        switch (name) {
            case 'spencer':
                spreadsheetApi.setSpencerAway(true);
                spencerRooms.forEach(roomName => {
                    setTemp(roomName, 'away');
                });
                break;
            case 'michael':
                spreadsheetApi.setMichaelAway(true);
                michaelRooms.forEach(roomName => {
                    setTemp(roomName, 'away');
                });
                break;
            default:
                break;
        }

        // If everyone is away, set common rooms to away
        if (spreadsheetApi.getAllAway()) {
            commonRooms.forEach(roomName => {
                setTemp(roomName, 'away');
            });
        }
        return 'See you later!';
    }

    log(`${name} arriving home`);

    // Resume relevant rooms
    switch (name) {
        case 'spencer':
            spreadsheetApi.setSpencerAway(false);
            spencerRooms.forEach(roomName => {
                resumeSchedule(roomName);
            });
            break;
        case 'michael':
            spreadsheetApi.setMichaelAway(false);
            michaelRooms.forEach(roomName => {
                resumeSchedule(roomName);
            });
            break;
        default:
            break;
    }

    // Resume common rooms
    commonRooms.forEach(roomName => resumeSchedule(roomName));

    return 'Welcome home!';
}
