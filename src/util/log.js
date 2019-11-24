/* global SpreadsheetApp */
import moment from 'moment';
/**
 * Logs the message into a google spreadsheet so it can be viewed later.
 *
 * @param {String} message The message to be logged
 */
export default function log(...message) {
    const spreadsheet = SpreadsheetApp.openByUrl(
        'https://docs.google.com/spreadsheets/d/1k0IFQt2_8IGewYpHcTP1sgD8xhVJWD73OFyQyhJLoNQ/edit#gid=0'
    );
    const sheet = spreadsheet.getSheetByName('Logs');
    sheet.appendRow([moment().format(), ...message]);
}
