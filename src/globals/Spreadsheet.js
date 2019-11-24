/* global SpreadsheetApp */

/**
 * The spreadsheet that backs the script.
 * https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet
 * @type {Spreadsheet}
 */
export default function getSpreadsheet() {
    return SpreadsheetApp.openByUrl(
        'https://docs.google.com/spreadsheets/d/1k0IFQt2_8IGewYpHcTP1sgD8xhVJWD73OFyQyhJLoNQ/edit#gid=0'
    );
}
