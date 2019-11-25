import getSpreadsheet from '../globals/Spreadsheet';

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

    getSpencerAway() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const awayCell = statusSheet.getRange(3, 2);
        return awayCell.getValue();
    }

    setSpencerAway(value) {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const awayCell = statusSheet.getRange(3, 2);
        return awayCell.setValue(value);
    }

    getMichaelAway() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const awayCell = statusSheet.getRange(4, 2);
        return awayCell.getValue();
    }

    setMichaelAway(value) {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const awayCell = statusSheet.getRange(4, 2);
        return awayCell.setValue(value);
    }

    getAllAway() {
        return this.getSpencerAway() && this.getMichaelAway();
    }
}

export default new SpreadsheetApi();
