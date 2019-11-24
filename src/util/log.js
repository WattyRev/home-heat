/* global SpreadsheetApp */
import moment from 'moment';

const MAX_LOG_COLUMNS = 10;
const MAX_LOG_ROWS = 400;

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
    const newEntry = formatMessage(...message);

    const logRange = sheet.getRange(1, 1, MAX_LOG_ROWS, MAX_LOG_COLUMNS);
    const entries = logRange.getValues();

    // Add the new entry at the top of the log
    entries.unshift(newEntry);
    // Delete the entry at the bottom of the log
    entries.splice(-1, 1);

    // Save the log
    logRange.setValues(entries);
}

/**
 * Formats the message to be ready for insertion to the spreadsheet
 * @param  {String} message
 */
function formatMessage(...message) {
    if (message.length > MAX_LOG_COLUMNS - 1) {
        throw new Error('cannot log this many messages');
    }
    const base = [moment().format(), ...message];
    for (let i = base.length; i < MAX_LOG_COLUMNS; i++) {
        base.push('');
    }
    return base;
}
