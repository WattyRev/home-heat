/* global SpreadsheetApp */

/**
 * The spreadsheet that backs the script.
 * https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
 * @type {Spreadsheet}
 */
export const spreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1k0IFQt2_8IGewYpHcTP1sgD8xhVJWD73OFyQyhJLoNQ/edit#gid=0'
);

/**
 * The sheet containing logs
 * https://developers.google.com/apps-script/reference/spreadsheet/sheet
 * @type {Sheet}
 */
export const logsSheet = spreadsheet.getSheetByName('Logs');

/**
 * Sheets containing scheduling for each room.
 * https://developers.google.com/apps-script/reference/spreadsheet/sheet
 * @type {Object<Sheet>}
 */
export const schedulesByRoomName = {
    office: spreadsheet.getSheetByName('Office Schedule'),
    bedroom: spreadsheet.getSheetByName('Bedroom Schedule'),
    bathroom: spreadsheet.getSheetByName('Bathroom Schedule'),
    living_room: spreadsheet.getSheetByName('Living Room Schedule'),
    game_room: spreadsheet.getSheetByName('Game Room Schedule'),
    guest_room: spreadsheet.getSheetByName('Guest Room Schedule'),
    guest_bathroom: spreadsheet.getSheetByName('Guest Bathroom Schedule'),
};