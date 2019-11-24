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

    getIsAway() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const awayCell = statusSheet.getRange(1, 2);
        return awayCell.getValue();
    }

    setIsAway(value) {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const awayCell = statusSheet.getRange(1, 2);
        return awayCell.setValue(value);
    }

    getIsVacation() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const vacationCell = statusSheet.getRange(2, 2);
        return vacationCell.getValue();
    }

    setIsVacation(value) {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        const vacationCell = statusSheet.getRange(2, 2);
        return vacationCell.setValue(value);
    }
}

export default new SpreadsheetApi();
