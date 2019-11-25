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
    describe('getSpencerAway', () => {
        it('gets the stored away value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                        ['Spencer Away', true],
                        ['Michael Away', false],
                    ],
                })
            );
            const response = api.getSpencerAway();
            expect(response).toEqual(true);
        });
    });
    describe('setSpencerAway', () => {
        it('sets the stored away value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                        ['Spencer Away', true],
                        ['Michael Away', false],
                    ],
                })
            );
            const response = api.setSpencerAway(false);
            expect(response.getRange(3, 2).getValue()).toEqual(false);
        });
    });
    describe('getMichaelAway', () => {
        it('gets the stored away value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                        ['Spencer Away', true],
                        ['Michael Away', false],
                    ],
                })
            );
            const response = api.getMichaelAway();
            expect(response).toEqual(false);
        });
    });
    describe('setMichaelAway', () => {
        it('sets the stored away value', () => {
            expect.assertions(1);
            getSpreadsheet.mockReturnValue(
                createMockSpreadsheet({
                    Status: [
                        ['Away', true],
                        ['Vacation', false],
                        ['Spencer Away', true],
                        ['Michael Away', false],
                    ],
                })
            );
            const response = api.setMichaelAway(true);
            expect(response.getRange(4, 2).getValue()).toEqual(true);
        });
    });
});
