/* global SpreadsheetApp */

/**
 * The spreadsheet that backs the script.
 * https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
 * @type {Spreadsheet}
 */
export function getSpreadsheet() {
    return SpreadsheetApp.openByUrl(
        'https://docs.google.com/spreadsheets/d/1k0IFQt2_8IGewYpHcTP1sgD8xhVJWD73OFyQyhJLoNQ/edit#gid=0'
    );
}

/**
 * The sheet containing logs
 * https://developers.google.com/apps-script/reference/spreadsheet/sheet
 * @type {Sheet}
 */
export function getLogsSheet() {
    return getSpreadsheet().getSheetByName('Logs');
}

/**
 * Sheets containing scheduling for each room.
 * https://developers.google.com/apps-script/reference/spreadsheet/sheet
 * @type {Object<Sheet>}
 */
export function getSchedulesByRoomName() {
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

class Status {
    constructor() {
        const spreadsheet = getSpreadsheet();
        const statusSheet = spreadsheet.getSheetByName('Status');
        this.awayCell = statusSheet.getRange(1, 2);
        this.isAway = this.awayCell.getValue();
        this.vacationCell = statusSheet.getRange(2, 2);
        this.isVacation = this.vacationCell.getValue();
    }

    setAway(isAway) {
        this.awayCell.setValue(isAway);
        this.isAway = isAway;
    }

    setVacation(isVacation) {
        this.vacationCell.setValue(isVacation);
        this.isVacation = isVacation;
    }
}
export function getStatus() {
    return new Status();
}
