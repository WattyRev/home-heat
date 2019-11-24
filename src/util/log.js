import moment from 'moment';
import spreadsheetApi from '../api/SpreadsheetApi';

const MAX_LOG_COLUMNS = 10;
const MAX_LOG_ROWS = 400;

/**
 * Logs the message into a google spreadsheet so it can be viewed later.
 *
 * @param {String} message The message to be logged
 */
export default function log(...message) {
    const sheet = spreadsheetApi.getLogsSheet();
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
