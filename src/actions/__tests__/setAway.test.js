import spreadsheetApi from '../../api/SpreadsheetApi';
import { resumeSchedule } from '../resumeSchedules';
import setTemp from '../setTemp';
import setAway from '../setAway';

jest.mock('../../api/SpreadsheetApi');
jest.mock('../setTemp');
jest.mock('../resumeSchedules');
jest.mock('../../util/log');

describe('setAway', () => {
    beforeEach(() => {
        const roomUsersMap = {
            office: ['spencer'],
            bedroom: ['spencer'],
            bathroom: ['spencer'],
            guest_room: ['michael'],
            guest_bathroom: ['michael'],
            living_room: ['spencer', 'michael'],
            game_room: ['spencer', 'michael'],
        };
        spreadsheetApi.getAway.mockReturnValue([]);
        spreadsheetApi.getUsersForRoom.mockImplementation(room => roomUsersMap[room]);
        spreadsheetApi.getUsers.mockReturnValue(['spencer', 'michael']);
    });
    describe('isAway = true', () => {
        it('adds the user to the away list', () => {
            expect.assertions(1);
            setAway('spencer', true);
            expect(spreadsheetApi.addAway).toHaveBeenCalledWith('spencer');
        });
        it('only sets rooms that the user uses to away', () => {
            expect.assertions(7);
            setAway('spencer', true);
            expect(setTemp).toHaveBeenCalledWith('office', 55);
            expect(setTemp).toHaveBeenCalledWith('bedroom', 55);
            expect(setTemp).toHaveBeenCalledWith('bathroom', 55);
            expect(setTemp).not.toHaveBeenCalledWith('living_room', 55);
            expect(setTemp).not.toHaveBeenCalledWith('game_room', 55);
            expect(setTemp).not.toHaveBeenCalledWith('guest_room', 55);
            expect(setTemp).not.toHaveBeenCalledWith('guest_bathroom', 55);
        });
        it('it sets shared rooms to away if all the room users are now away', () => {
            expect.assertions(2);
            spreadsheetApi.getAway.mockReturnValue(['michael']);
            setAway('spencer', true);
            expect(setTemp).toHaveBeenCalledWith('living_room', 55);
            expect(setTemp).toHaveBeenCalledWith('game_room', 55);
        });
    });
    describe('isAway = false', () => {
        beforeEach(() => {
            spreadsheetApi.getAway.mockReturnValue(['spencer', 'michael']);
        });
        it('removes the user from the away list', () => {
            expect.assertions(1);
            setAway('spencer', false);
            expect(spreadsheetApi.removeAway).toHaveBeenCalledWith('spencer');
        });
        it('resumes rooms that the user uses including shared rooms', () => {
            expect.assertions(7);
            setAway('spencer', false);
            expect(resumeSchedule).toHaveBeenCalledWith('office');
            expect(resumeSchedule).toHaveBeenCalledWith('bedroom');
            expect(resumeSchedule).toHaveBeenCalledWith('bathroom');
            expect(resumeSchedule).toHaveBeenCalledWith('living_room');
            expect(resumeSchedule).toHaveBeenCalledWith('game_room');
            expect(resumeSchedule).not.toHaveBeenCalledWith('guest_room');
            expect(resumeSchedule).not.toHaveBeenCalledWith('guest_bathroom');
        });
        it('does not resume rooms that had a previously present user', () => {
            expect.assertions(7);
            spreadsheetApi.getAway.mockReturnValue(['spencer']);
            setAway('spencer', false);
            expect(resumeSchedule).toHaveBeenCalledWith('office');
            expect(resumeSchedule).toHaveBeenCalledWith('bedroom');
            expect(resumeSchedule).toHaveBeenCalledWith('bathroom');
            expect(resumeSchedule).not.toHaveBeenCalledWith('living_room');
            expect(resumeSchedule).not.toHaveBeenCalledWith('game_room');
            expect(resumeSchedule).not.toHaveBeenCalledWith('guest_room');
            expect(resumeSchedule).not.toHaveBeenCalledWith('guest_bathroom');
        });
    });
});
