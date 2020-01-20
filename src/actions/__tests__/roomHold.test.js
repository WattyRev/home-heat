import spreadsheetApi from '../../api/SpreadsheetApi';
import { hold, stopHold } from '../roomHold';

jest.mock('../../api/SpreadsheetApi');

describe('roomHold', () => {
    describe('hold', () => {
        it('sets the room on hold', () => {
            expect.assertions(1);
            hold('living room');
            expect(spreadsheetApi.addHold).toHaveBeenCalledWith('living_room');
        });
        it('throws if the room is not recognized', () => {
            expect.assertions(2);
            expect(() => hold('boiler room')).toThrow();
            expect(spreadsheetApi.addHold).not.toHaveBeenCalled();
        });
    });
    describe('stopHold', () => {
        it('removes the room from hold', () => {
            expect.assertions(1);
            stopHold('living room');
            expect(spreadsheetApi.removeHold).toHaveBeenCalledWith('living_room');
        });
        it('throws if the room is not recognized', () => {
            expect.assertions(2);
            expect(() => stopHold('boiler room')).toThrow();
            expect(spreadsheetApi.removeHold).not.toHaveBeenCalled();
        });
    });
});