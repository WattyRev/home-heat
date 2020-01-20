import { roomAliases } from '../constants/rooms';
import spreadsheetApi from '../api/SpreadsheetApi';

/**
 * Puts the specified room on hold, preventing the temperature from being
 * changed automatically
 * @param  {String} room
 */
export function hold(colloquialRoom) {
    const room = getRoom(colloquialRoom);
    if (!room) {
        throw new Error(
            `Attempted to place "${colloquialRoom}" on hold, but it does not match any room alias.`
        );
    }
    spreadsheetApi.addHold(room);
}

/**
 * Takes the specified room off of hold, so that the temperature may be changed
 * automatically.
 * @param  {String} room
 */
export function stopHold(colloquialRoom) {
    const room = getRoom(colloquialRoom);
    if (!room) {
        throw new Error(
            `Attempted to remove "${colloquialRoom}" from hold, but it does not match any room alias.`
        );
    }
    spreadsheetApi.removeHold(room);
}

/**
 * Find the proper room name given a colloquial (commonly spoken) room name.
 * @param  {String} colloquialRoom
 * @return {String} An official room name, e.g. ('bathroom', or 'living_room').
 * Returns undefined if no room is found.
 */
function getRoom(colloquialRoom) {
    const cleanedColloquialRoom = colloquialRoom.trim().toLowerCase();
    return Object.keys(roomAliases).find(roomName => {
        const aliases = roomAliases[roomName];
        const match = aliases.find(alias => alias === cleanedColloquialRoom);
        return !!match;
    });
}
