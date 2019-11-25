import spreadsheetApi from '../../api/SpreadsheetApi';
import { spencerRooms, michaelRooms, commonRooms } from '../../constants/rooms';
import { resumeSchedule } from '../resumeSchedules';
import setTemp from '../setTemp';
import setAway from '../setAway';

jest.mock('../../api/SpreadsheetApi');
jest.mock('../setTemp');
jest.mock('../resumeSchedules');
jest.mock('../../util/log');

describe('setAway', () => {
    describe('name = spencer', () => {
        describe('setting to true', () => {
            it('sets spencerAway status to true', () => {
                expect.assertions(1);
                setAway('spencer', true);
                expect(spreadsheetApi.setSpencerAway).toHaveBeenCalledWith(true);
            });
            it("sets each of spencer's rooms to away temperature", () => {
                expect.assertions(spencerRooms.length);
                setAway('spencer', true);
                spencerRooms.forEach(room => {
                    expect(setTemp).toHaveBeenCalledWith(room, 'away');
                });
            });
            it('sets the common rooms to away if michael was already away', () => {
                expect.assertions(commonRooms.length);
                spreadsheetApi.getAllAway.mockReturnValue(true);
                setAway('spencer', true);
                commonRooms.forEach(room => {
                    expect(setTemp).toHaveBeenCalledWith(room, 'away');
                });
            });
            it('does not set the common rooms to away if michael was not away', () => {
                expect.assertions(commonRooms.length);
                spreadsheetApi.getAllAway.mockReturnValue(false);
                setAway('spencer', true);
                commonRooms.forEach(room => {
                    expect(setTemp).not.toHaveBeenCalledWith(room, 'away');
                });
            });
        });
        describe('setting to false', () => {
            it('sets spencerAway status to false', () => {
                expect.assertions(1);
                setAway('spencer', false);
                expect(spreadsheetApi.setSpencerAway).toHaveBeenCalledWith(false);
            });
            it("resumes each of spencer's rooms", () => {
                expect.assertions(spencerRooms.length);
                setAway('spencer', false);
                spencerRooms.forEach(room => {
                    expect(resumeSchedule).toHaveBeenCalledWith(room);
                });
            });
            it('resumes all of the common rooms', () => {
                expect.assertions(commonRooms.length);
                setAway('spencer', false);
                commonRooms.forEach(room => {
                    expect(resumeSchedule).toHaveBeenCalledWith(room);
                });
            });
        });
    });
    describe('name = michael', () => {
        describe('setting to true', () => {
            it('sets michaelAway status to true', () => {
                expect.assertions(1);
                setAway('michael', true);
                expect(spreadsheetApi.setMichaelAway).toHaveBeenCalledWith(true);
            });
            it("sets each of michael's rooms to away temperature", () => {
                expect.assertions(michaelRooms.length);
                setAway('michael', true);
                michaelRooms.forEach(room => {
                    expect(setTemp).toHaveBeenCalledWith(room, 'away');
                });
            });
            it('sets the common rooms to away if spencer was already away', () => {
                expect.assertions(commonRooms.length);
                spreadsheetApi.getAllAway.mockReturnValue(true);
                setAway('michael', true);
                commonRooms.forEach(room => {
                    expect(setTemp).toHaveBeenCalledWith(room, 'away');
                });
            });
            it('does not set the common rooms to away if spencer was not away', () => {
                expect.assertions(commonRooms.length);
                spreadsheetApi.getAllAway.mockReturnValue(false);
                setAway('michael', true);
                commonRooms.forEach(room => {
                    expect(setTemp).not.toHaveBeenCalledWith(room, 'away');
                });
            });
        });
        describe('setting to false', () => {
            it('sets michaelAway status to false', () => {
                expect.assertions(1);
                setAway('michael', false);
                expect(spreadsheetApi.setMichaelAway).toHaveBeenCalledWith(false);
            });
            it("resumes each of michael's rooms", () => {
                expect.assertions(michaelRooms.length);
                setAway('michael', false);
                michaelRooms.forEach(room => {
                    expect(resumeSchedule).toHaveBeenCalledWith(room);
                });
            });
            it('resumes all of the common rooms', () => {
                expect.assertions(commonRooms.length);
                setAway('michael', false);
                commonRooms.forEach(room => {
                    expect(resumeSchedule).toHaveBeenCalledWith(room);
                });
            });
        });
    });
});
