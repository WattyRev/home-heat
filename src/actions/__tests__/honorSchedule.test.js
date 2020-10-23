import MockDate from 'mockdate';
import spreadsheetApi from '../../api/SpreadsheetApi';
import honorSchedule from '../honorSchedule';
import {
    createMockScheduleSheet,
    getBaseScheduleValues,
    createScheduleRow,
} from '../../../testUtils/sheet';

jest.mock('../../api/SpreadsheetApi');
jest.mock('../../util/log');
jest.mock('../setTemp');

describe('honorSchedule', () => {
    beforeEach(() => {
        // Mock current time to Sunday 10:00 AM
        MockDate.set('2019-11-24T10:00:00.000Z');
        spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
            office: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 60),
            ]),
            bedroom: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 69),
            ]),
            bathroom: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 80),
            ]),
            living_room: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T09:00:00.000Z', 55),
                createScheduleRow('1899-12-30T10:00:00.000Z', 72),
            ]),
            game_room: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 55),
            ]),
            guest_room: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 69),
            ]),
            guest_bathroom: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 80),
            ]),
        });
        spreadsheetApi.getAway.mockReturnValue([]);
        spreadsheetApi.getUsersForRoom.mockImplementation(roomName => {
            const map = {
                office: ['spencer'],
                bedroom: ['spencer'],
                bathroom: ['spencer'],
                living_room: ['spencer', 'michael'],
                game_room: ['spencer', 'michael'],
                guest_room: ['michael'],
                guest_bathroom: ['michael'],
            };
            return map[roomName];
        });
    });
    it('does not take any action if no events line up', () => {
        expect.assertions(1);
        spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
            office: createMockScheduleSheet(),
        });
        const response = honorSchedule();
        expect(response).toEqual('No actions to take at this time.');
    });
    it('calls setTemp for each action to take', () => {
        expect.assertions(1);
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to 60F',
            '* Set bedroom to 69F',
            '* Set bathroom to 80F',
            '* Set living_room to 72F',
            '* Set game_room to 55F',
            '* Set guest_room to 69F',
            '* Set guest_bathroom to 80F',
            '',
        ]);
    });
    it('maintains away temperature on all rooms if everyone is away', () => {
        expect.assertions(1);
        spreadsheetApi.getAway.mockReturnValue(['michael', 'spencer']);
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to 55F',
            '* Set bedroom to 55F',
            '* Set bathroom to 55F',
            '* Set living_room to 55F',
            '* Set game_room to 55F',
            '* Set guest_room to 55F',
            '* Set guest_bathroom to 55F',
            '',
        ]);
    });
    it("maintains away temperature on Spencer's rooms if he is away", () => {
        expect.assertions(1);
        spreadsheetApi.getAway.mockReturnValue(['spencer']);
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to 55F',
            '* Set bedroom to 55F',
            '* Set bathroom to 55F',
            '* Set living_room to 72F',
            '* Set game_room to 55F',
            '* Set guest_room to 69F',
            '* Set guest_bathroom to 80F',
            '',
        ]);
    });
    it("does not take action on Michael's rooms if he is away", () => {
        expect.assertions(1);
        spreadsheetApi.getAway.mockReturnValue(['michael']);
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to 60F',
            '* Set bedroom to 69F',
            '* Set bathroom to 80F',
            '* Set living_room to 72F',
            '* Set game_room to 55F',
            '* Set guest_room to 55F',
            '* Set guest_bathroom to 55F',
            '',
        ]);
    });
    it('gets the correct event by rounding up', () => {
        expect.assertions(1);
        // Mock current time to Sunday 9:56 AM
        MockDate.set('2019-11-24T09:56:00.000Z');
        spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
            office: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T09:50:00.000Z', 55),
                createScheduleRow('1899-12-30T10:00:00.000Z', 72),
            ]),
        });
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to 72F',
            '',
        ]);
    });
    it('gets the correct event by rounding down', () => {
        expect.assertions(1);
        // Mock current time to Sunday 9:54 AM
        MockDate.set('2019-11-24T09:54:00.000Z');
        spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
            office: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T09:50:00.000Z', 55),
                createScheduleRow('1899-12-30T10:00:00.000Z', 72),
            ]),
        });
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to 55F',
            '',
        ]);
    });
    describe('Days', () => {
        beforeEach(() => {
            spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
                office: createMockScheduleSheet([
                    ...getBaseScheduleValues(),
                    [
                        // Sunday
                        '1899-12-30T10:00:00.000Z',
                        1,
                        '1899-12-30T10:00:00.000Z',
                        2,
                        '1899-12-30T10:00:00.000Z',
                        3,
                        '1899-12-30T10:00:00.000Z',
                        4,
                        '1899-12-30T10:00:00.000Z',
                        5,
                        '1899-12-30T10:00:00.000Z',
                        6,
                        // Saturday
                        '1899-12-30T10:00:00.000Z',
                        7,
                    ],
                ]),
            });
        });
        it('honors the schedule on Sunday', () => {
            expect.assertions(1);
            // Mock current time to Sunday 10:00 AM
            MockDate.set('2019-11-24T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 1F',
                '',
            ]);
        });
        it('honors the schedule on Monday', () => {
            expect.assertions(1);
            // Mock current time to Monday 10:00 AM
            MockDate.set('2019-11-25T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 2F',
                '',
            ]);
        });
        it('honors the schedule on Tuesday', () => {
            expect.assertions(1);
            // Mock current time to Tuesday 10:00 AM
            MockDate.set('2019-11-26T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 3F',
                '',
            ]);
        });
        it('honors the schedule on Wednesday', () => {
            expect.assertions(1);
            // Mock current time to Wednesday 10:00 AM
            MockDate.set('2019-11-27T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 4F',
                '',
            ]);
        });
        it('honors the schedule on Thursday', () => {
            expect.assertions(1);
            // Mock current time to Thursday 10:00 AM
            MockDate.set('2019-11-28T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 5F',
                '',
            ]);
        });
        it('honors the schedule on Friday', () => {
            expect.assertions(1);
            // Mock current time to Friday 10:00 AM
            MockDate.set('2019-11-29T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 6F',
                '',
            ]);
        });
        it('honors the schedule on Saturday', () => {
            expect.assertions(1);
            // Mock current time to Saturday 10:00 AM
            MockDate.set('2019-11-30T10:00:00.000Z');
            const response = honorSchedule();
            expect(response.split('\n')).toEqual([
                'Took the following actions:',
                '* Set office to 7F',
                '',
            ]);
        });
    });
});
