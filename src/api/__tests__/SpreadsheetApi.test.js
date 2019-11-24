import getSpreadsheet from '../../globals/Spreadsheet';
import api from '../SpreadsheetApi';
import { createMockSpreadsheet } from '../../../testUtils/sheet';

jest.mock('../../globals/Spreadsheet');

describe('SpreadsheetApi', () => {
    beforeEach(() => {
        getSpreadsheet.mockReturnValue(createMockSpreadsheet());
    });
    describe('getLogsSheet', () => {
        it('returns the Logs sheet', () => {
            expect.assertions(1);
            const response = api.getLogsSheet();
            expect(response.getRange(1, 1).getValue()).toEqual('mock logs');
        });
    });
    describe('getSchedulesByRoomName', () => {
        it('returns all the schedule sheets indexed by room name', () => {
            expect.assertions(1);
            const response = api.getSchedulesByRoomName();
            expect(Object.keys(response)).toEqual([
                'office',
                'bedroom',
                'bathroom',
                'living_room',
                'game_room',
                'guest_room',
                'guest_bathroom',
            ]);
        });
    });
    describe('getIsAway', () => {
        it('gets the stored away value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                    ],
                })
            );
            const response = api.getIsAway();
            expect(response).toEqual(true);
        });
    });
    describe('setIsAway', () => {
        it('sets the stored away value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                    ],
                })
            );
            const response = api.setIsAway(false);
            expect(response.getRange(1, 2).getValue()).toEqual(false);
        });
    });
    describe('getIsVacation', () => {
        it('gets the stored vacation value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                    ],
                })
            );
            const response = api.getIsVacation();
            expect(response).toEqual(false);
        });
    });
    describe('setIsVacation', () => {
        it('sets the stored vacation value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                    ],
                })
            );
            const response = api.setIsVacation(true);
            expect(response.getRange(2, 2).getValue()).toEqual(true);
        });
    });
});
