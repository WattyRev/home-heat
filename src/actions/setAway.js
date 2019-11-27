import spreadsheetApi from '../api/SpreadsheetApi';
import rooms from '../constants/rooms';
import { resumeSchedule } from './resumeSchedules';
import setTemp from './setTemp';
import log from '../util/log';
import allArrayItemsInHaystack from '../util/allArrayItemsInHaystack';
import anyArrayItemsInHaystack from '../util/anyArrayItemsInHaystack';

export default function setAway(user, isAway) {
    // If setting away to true, set all relevant rooms to away temperature
    const awayUsers = spreadsheetApi.getAway();
    if (isAway) {
        log(`${user} leaving home`);

        // Set user as away
        spreadsheetApi.addAway(user);

        // Set all unused rooms to away
        const updatedAwayUsers = [...awayUsers, user];
        rooms.forEach(room => {
            const roomUsers = spreadsheetApi.getUsersForRoom(room);
            const allAway = allArrayItemsInHaystack(roomUsers, updatedAwayUsers);
            if (allAway) {
                setTemp(room, 'away');
            }
        });
        return 'See you later!';
    }

    log(`${user} arriving home`);

    // Set user as not away
    spreadsheetApi.removeAway(user);

    // Resume all rooms used by this user that did not already have a present user
    // The second check prevents overriding a user's manual temperature setting
    // when another room user gets home.
    const users = spreadsheetApi.getUsers();
    const previouslyPresentUsers = users.filter(_user => {
        if (awayUsers.includes(_user)) {
            return false;
        }
        if (_user === user) {
            return false;
        }
        return true;
    });
    rooms.forEach(room => {
        const roomUsers = spreadsheetApi.getUsersForRoom(room);
        if (
            roomUsers.includes(user) &&
            !anyArrayItemsInHaystack(roomUsers, previouslyPresentUsers)
        ) {
            resumeSchedule(room);
        }
    });

    return 'Welcome home!';
}
