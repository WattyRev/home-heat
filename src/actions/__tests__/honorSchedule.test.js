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
                createScheduleRow('1899-12-30T10:00:00.000Z', 'idle'),
            ]),
            bedroom: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'sleep'),
            ]),
            bathroom: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'shower'),
            ]),
            living_room: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T09:00:00.000Z', 'away'),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'comfort'),
            ]),
            game_room: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'away'),
            ]),
            guest_room: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'sleep'),
            ]),
            guest_bathroom: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'shower'),
            ]),
        });
        spreadsheetApi.getIsAway.mockReturnValue(false);
        spreadsheetApi.getIsVacation.mockReturnValue(false);
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
            '* Set office to idle',
            '* Set bedroom to sleep',
            '* Set bathroom to shower',
            '* Set living_room to comfort',
            '* Set game_room to away',
            '* Set guest_room to sleep',
            '* Set guest_bathroom to shower',
            '',
        ]);
    });
    it('does not take action if vacation status is set', () => {
        expect.assertions(1);
        spreadsheetApi.getIsAway.mockReturnValue(false);
        spreadsheetApi.getIsVacation.mockReturnValue(true);
        const response = honorSchedule();
        expect(response).toEqual('No actions to take at this time.');
    });
    it('does not take action on away rooms if away status is set', () => {
        expect.assertions(1);
        spreadsheetApi.getIsAway.mockReturnValue(true);
        spreadsheetApi.getIsVacation.mockReturnValue(false);
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set living_room to comfort',
            '* Set game_room to away',
            '* Set guest_room to sleep',
            '* Set guest_bathroom to shower',
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
                createScheduleRow('1899-12-30T09:50:00.000Z', 'away'),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'comfort'),
            ]),
        });
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to comfort',
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
                createScheduleRow('1899-12-30T09:50:00.000Z', 'away'),
                createScheduleRow('1899-12-30T10:00:00.000Z', 'comfort'),
            ]),
        });
        const response = honorSchedule();
        expect(response.split('\n')).toEqual([
            'Took the following actions:',
            '* Set office to away',
            '',
        ]);
    });
    describe('Days', () => {
        beforeEach(() => {
            spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
                office: createMockScheduleSheet([
                    ...getBaseScheduleValues(),
                    [
                        '1899-12-30T10:00:00.000Z',
                        'sundaytemp',
                        '1899-12-30T10:00:00.000Z',
                        'mondaytemp',
                        '1899-12-30T10:00:00.000Z',
                        'tuesdaytemp',
                        '1899-12-30T10:00:00.000Z',
                        'wednesdaytemp',
                        '1899-12-30T10:00:00.000Z',
                        'thursdaytemp',
                        '1899-12-30T10:00:00.000Z',
                        'fridaytemp',
                        '1899-12-30T10:00:00.000Z',
                        'saturdaytemp',
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
                '* Set office to sundaytemp',
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
                '* Set office to mondaytemp',
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
                '* Set office to tuesdaytemp',
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
                '* Set office to wednesdaytemp',
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
                '* Set office to thursdaytemp',
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
                '* Set office to fridaytemp',
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
                '* Set office to saturdaytemp',
                '',
            ]);
        });
    });
});
