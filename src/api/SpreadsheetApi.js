import getSpreadsheet from '../globals/Spreadsheet';
import rooms from '../constants/rooms';
import allArrayItemsInHaystack from '../util/allArrayItemsInHaystack';

class SpreadsheetApi {
    getLogsSheet() {
        return getSpreadsheet().getSheetByName('Logs');
    }

    getSchedulesByRoomName() {
        const spreadsheet = getSpreadsheet();
        return {
            office: spreadsheet.getSheetByName('Office Schedule'),
            bedroom: spreadsheet.getSheetByName('Bedroom Schedule'),
            bathroom: spreadsheet.getSheetByName('Bathroom Schedule'),
            living_room: spreadsheet.getSheetByName('Living Room Schedule'),
            game_room: spreadsheet.getSheetByName('Game Room Schedule'),
            guest_room: spreadsheet.getSheetByName('Guest Room Schedule'),
            guest_bathroom: spreadsheet.getSheetByName('Guest Bathroom Schedule'),
        };
    }

    /**
     * Get the cell that contains Away settings
     * @return {Range} https://developers.google.com/apps-script/reference/spreadsheet/range
     */
    getAwayCell() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        return statusSheet.getRange(1, 2);
    }

    /**
     * Get all the users that are currently away.
     * @return {String[]}
     */
    getAway() {
        const awayCell = this.getAwayCell();
        const value = awayCell.getValue();
        return value ? value.split(', ') : [];
    }

    /**
     * Add the provided name to the away list
     * @param {String} name The name of the person who has gone away
     */
    addAway(user) {
        // Validate
        const awayUsers = this.getAway();
        if (awayUsers.includes(user)) {
            throw new Error(
                `Attempted to set ${user} as away even though ${user} is already away.`
            );
        }
        if (!this.getUsers().includes(user)) {
            throw new Error(
                `Attempted to set ${user} as away, but ${user} is not on the list of users in Config:B1.`
            );
        }

        // Add user to list
        awayUsers.push(user);

        // Save
        const awayCell = this.getAwayCell();
        awayCell.setValue(awayUsers.join(', '));
    }

    /**
     * Remove the provided name from the away list
     * @param {String} user The user of the person who has come home
     */
    removeAway(user) {
        // Validate
        let awayUsers = this.getAway();
        if (!awayUsers.includes(user)) {
            throw new Error(
                `Attempted to remove ${user} from away even though ${user} is not away.`
            );
        }
        if (!this.getUsers().includes(user)) {
            throw new Error(
                `Attempted to remove ${user} from away, but ${user} is not on the list of users in Config:B1.`
            );
        }

        // Remove user from list
        awayUsers = awayUsers.filter(awayUser => awayUser !== user);

        // Save
        const awayCell = this.getAwayCell();
        awayCell.setValue(awayUsers.join(', '));
    }

    /**
     * Get all the users who use rooms in the house.
     * @return {String[]} User's names
     */
    getUsers() {
        const spreadsheet = getSpreadsheet();
        const configSheet = spreadsheet.getSheetByName('Config');
        const usersCell = configSheet.getRange(1, 2);
        const value = usersCell.getValue();
        return value ? value.split(', ') : [];
    }

    /**
     * Determine if all users are away.
     * @return {Boolean} true if all users are away
     */
    getAllAway() {
        const users = this.getUsers();
        const awayUsers = this.getAway();

        // Check that every user is present in the awayUsers list.
        return allArrayItemsInHaystack(users, awayUsers);
    }

    /**
     * Given a room name, return the names of users that use the room.
     * @param  {String} roomName
     * @return {String[]} An array of users that use the room.
     */
    getUsersForRoom(roomName) {
        const cellsByRoom = {
            office: [2, 2],
            bedroom: [3, 2],
            bathroom: [4, 2],
            living_room: [5, 2],
            game_room: [6, 2],
            guest_room: [7, 2],
            guest_bathroom: [8, 2],
        };

        const spreadsheet = getSpreadsheet();
        const configSheet = spreadsheet.getSheetByName('Config');
        const cellRef = cellsByRoom[roomName];
        if (!cellRef) {
            throw new Error(
                `Attempted to get users for room ${roomName}, but the settings could not be found.`
            );
        }
        const cell = configSheet.getRange(...cellRef);
        const value = cell.getValue();
        return value ? value.split(', ') : [];
    }

    get holdCell() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        return statusSheet.getRange(2, 2);
    }

    /**
     * Get all the rooms that are currently on hold.
     * @return {String[]}
     */
    getHold() {
        const value = this.holdCell.getValue();
        return value ? value.split(', ') : [];
    }

    /**
     * Add the provided room to the hold list
     * @param {String} room The name of the room to put on hold
     */
    addHold(room) {
        // Validate
        const hold = this.getHold();
        if (hold.includes(room)) {
            throw new Error(
                `Attempted to set ${room} on hold even though ${room} is already on hold.`
            );
        }
        if (!rooms.includes(room)) {
            throw new Error(
                `Attempted to set ${room} on hold, but ${room} is not a supported room name.`
            );
        }

        // Add room to list
        hold.push(room);

        // Save
        this.holdCell.setValue(hold.join(', '));
    }

    /**
     * Remove the provided room from the hold list
     * @param {String} room The room that is to be taken off of hold
     */
    removeHold(room) {
        // Validate
        let hold = this.getHold();
        if (!hold.includes(room)) {
            throw new Error(
                `Attempted to remove ${room} from hold even though ${room} is not on hold.`
            );
        }
        if (!rooms.includes(room)) {
            throw new Error(
                `Attempted to remove ${room} from hold, but ${room} is not a supported room name`
            );
        }

        // Remove user from list
        hold = hold.filter(holdRoom => holdRoom !== room);

        // Save
        this.holdCell.setValue(hold.join(', '));
    }
}

export default new SpreadsheetApi();
