import { getStatus } from '../../globals/Spreadsheet';
import rooms from '../../constants/rooms';
import setTemp from '../setTemp';
import resumeSchedule from '../resumeSchedule';
import setVacation from '../setVacation';

jest.mock('../../globals/Spreadsheet');
jest.mock('../setTemp');
jest.mock('../resumeSchedule');
jest.mock('../../util/log');

describe('setVacation', () => {
    let mockSetVacation;
    let mockSetAway;
    beforeEach(() => {
        mockSetVacation = jest.fn();
        mockSetAway = jest.fn();
        getStatus.mockReturnValue({
            setAway: mockSetAway,
            setVacation: mockSetVacation,
        });
    });
    describe('setting to true', () => {
        it('sets vacation status to true', () => {
            expect.assertions(1);
            setVacation(true);
            expect(mockSetVacation).toHaveBeenCalledWith(true);
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
            expect(mockSetAway).toHaveBeenCalledWith(false);
        });
        it('sets vacation to false', () => {
            expect.assertions(1);
            setVacation(false);
            expect(mockSetVacation).toHaveBeenCalledWith(false);
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
