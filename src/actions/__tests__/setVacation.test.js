import spreadsheetApi from '../../api/SpreadsheetApi';
import rooms from '../../constants/rooms';
import setTemp from '../setTemp';
import resumeSchedule from '../resumeSchedule';
import setVacation from '../setVacation';

jest.mock('../../api/SpreadsheetApi');
jest.mock('../setTemp');
jest.mock('../resumeSchedule');
jest.mock('../../util/log');

describe('setVacation', () => {
    describe('setting to true', () => {
        it('sets vacation status to true', () => {
            expect.assertions(1);
            setVacation(true);
            expect(spreadsheetApi.setIsVacation).toHaveBeenCalledWith(true);
        });
        it('sets each room to away temperature', () => {
            expect.assertions(rooms.length);
            setVacation(true);
            rooms.forEach(room => {
                expect(setTemp).toHaveBeenCalledWith(room, 'away');
            });
        });
    });
    describe('setting to false', () => {
        it('sets away to false', () => {
            expect.assertions(1);
            setVacation(false);
            expect(spreadsheetApi.setIsAway).toHaveBeenCalledWith(false);
        });
        it('sets vacation to false', () => {
            expect.assertions(1);
            setVacation(false);
            expect(spreadsheetApi.setIsVacation).toHaveBeenCalledWith(false);
        });
        it('resumes the schedule for every room', () => {
            expect.assertions(rooms.length);
            setVacation(false);
            rooms.forEach(room => {
                expect(resumeSchedule).toHaveBeenCalledWith(room);
            });
        });
    });
});
