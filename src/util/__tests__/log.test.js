import { createMockSheet } from '../../../testUtils/sheet';
import spreadsheetApi from '../../api/SpreadsheetApi';
import log, { MAX_LOG_ROWS } from '../log';

jest.mock('../../api/SpreadsheetApi');

function getMockLogData() {
    const logs = [];
    for (let i = 0; i < MAX_LOG_ROWS; i++) {
        logs.push(['timestamp', `Mock log message ${i + 1}`]);
    }
    return logs;
}

describe('log', () => {
    beforeEach(() => {
        const mockLogData = getMockLogData();
        const mockSheet = createMockSheet(mockLogData);
        spreadsheetApi.getLogsSheet.mockReturnValue(mockSheet);
    });
    it('adds a new log message at the top of the spreadsheet', () => {
        expect.assertions(1);
        const updatedSheet = log('foo');
        expect(updatedSheet.getRange(1, 2).getValue()).toEqual('foo');
    });
    it('deletes the log message that was on row 400', () => {
        expect.assertions(2);
        const updatedSheet = log('foo');
        expect(updatedSheet.getRange(400, 2).getValue()).toEqual('Mock log message 399');
        expect(() => updatedSheet.getRange(401, 2).getValue()).toThrow();
    });
});
