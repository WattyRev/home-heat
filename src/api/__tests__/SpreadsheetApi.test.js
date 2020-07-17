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
    describe('getRoomAliases', () => {
        it('gets all the room aliases from the Config sheet', () => {
            expect.assertions(1);
            const response = api.getRoomAliases();
            expect(response).toEqual({
                living_room: ['living room', 'the living room'],
                bedroom: ['bedroom', 'the bedroom'],
                office: ['office', 'the office'],
                bathroom: ['bathroom', 'the bathroom'],
                game_room: ['game room', 'the game room', 'dining room', 'the dining room'],
                guest_room: ['guest room', 'the guest room', 'guest bedroom', 'the guest bedroom'],
                guest_bathroom: ['guest bathroom', 'the guest bathroom'],
            });
        });
    });
    describe('getAway', () => {
        it('returns an array of away users', () => {
            expect.assertions(1);
            const awayUsers = api.getAway();
            expect(awayUsers).toEqual(['michael']);
        });
    });
    describe('addAway', () => {
        it('adds the specified user to the away users list', () => {
            expect.assertions(2);
            expect(api.getAway()).toEqual(['michael']);
            api.addAway('spencer');
            expect(api.getAway()).toEqual(['michael', 'spencer']);
        });
        it('throws if the user was already away', () => {
            expect.assertions(1);
            api.addAway('spencer');
            expect(() => api.addAway('spencer')).toThrow();
        });
        it('throws if an invalid user is provided', () => {
            expect.assertions(1);
            expect(() => api.addAway('shitface')).toThrow();
        });
    });
    describe('removeAway', () => {
        it('removes the user from the away list', () => {
            expect.assertions(2);
            expect(api.getAway()).toEqual(['michael']);
            api.removeAway('michael');
            expect(api.getAway()).toEqual([]);
        });
        it('throws if the user was not on the away list', () => {
            expect.assertions(1);
            api.removeAway('michael');
            expect(() => api.removeAway('michael')).toThrow();
        });
        it('throws if an invalid user was provided', () => {
            expect.assertions(1);
            expect(() => api.removeAway('fuckface')).toThrow();
        });
    });
    describe('getUsers', () => {
        it('returns a list of users from the spreadsheet', () => {
            expect.assertions(1);
            expect(api.getUsers()).toEqual(['spencer', 'michael']);
        });
    });
    describe('getUsersForRoom', () => {
        it('gets the users for each room', () => {
            expect.assertions(7);
            expect(api.getUsersForRoom('office')).toEqual(['spencer']);
            expect(api.getUsersForRoom('bedroom')).toEqual(['spencer']);
            expect(api.getUsersForRoom('bathroom')).toEqual(['spencer']);
            expect(api.getUsersForRoom('living_room')).toEqual(['spencer', 'michael']);
            expect(api.getUsersForRoom('game_room')).toEqual(['spencer', 'michael']);
            expect(api.getUsersForRoom('guest_room')).toEqual(['michael']);
            expect(api.getUsersForRoom('guest_bathroom')).toEqual(['michael']);
        });
        it('throws if an invalid room was provided', () => {
            expect.assertions(1);
            expect(() => api.getUsersForRoom('adult_movie_theater')).toThrow();
        });
    });
    describe('getHold', () => {
        it('returns an array of rooms on hold', () => {
            expect.assertions(1);
            const holdRooms = api.getHold();
            expect(holdRooms).toEqual(['office']);
        });
    });
    describe('addHold', () => {
        it('adds the specified room to the hold list', () => {
            expect.assertions(2);
            expect(api.getHold()).toEqual(['office']);
            api.addHold('bedroom');
            expect(api.getHold()).toEqual(['office', 'bedroom']);
        });
        it('throws if the room was already on hold', () => {
            expect.assertions(1);
            api.addHold('bedroom');
            expect(() => api.addHold('bedroom')).toThrow();
        });
        it('throws if an invalid room is provided', () => {
            expect.assertions(1);
            expect(() => api.addHold('shitface')).toThrow();
        });
    });
    describe('removeHold', () => {
        it('removes the room from the hold list', () => {
            expect.assertions(2);
            expect(api.getHold()).toEqual(['office']);
            api.removeHold('office');
            expect(api.getHold()).toEqual([]);
        });
        it('throws if the room was not on the hold list', () => {
            expect.assertions(1);
            api.removeHold('office');
            expect(() => api.removeHold('office')).toThrow();
        });
        it('throws if an invalid room was provided', () => {
            expect.assertions(1);
            expect(() => api.removeHold('fuckface')).toThrow();
        });
    });
    describe('getWeatherOverrideTemp', () => {
        it('returns the set weather override temperature as an integer', () => {
            expect.assertions(1);
            const response = api.getWeatherOverrideTemp();
            expect(response).toEqual(75);
        });
    });
});
