import MockDate from 'mockdate';
import spreadsheetApi from '../../api/SpreadsheetApi';
import setTemp from '../setTemp';
import { resumeSchedule } from '../resumeSchedules';
import {
    createMockScheduleSheet,
    getBaseScheduleValues,
    createScheduleRow,
} from '../../../testUtils/sheet';
import awayService from '../../services/awayService';

jest.mock('../setTemp');
jest.mock('../../api/SpreadsheetApi');
jest.mock('../../services/awayService');

describe('resumeShedule', () => {
    beforeEach(() => {
        spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
            office: createMockScheduleSheet([
                ...getBaseScheduleValues(),
                createScheduleRow('', '', '', '', '1899-12-30T10:00:00.000Z', 55),
                createScheduleRow('', '', '', '', '1899-12-30T14:00:00.000Z', 72),
                createScheduleRow('', '', '', '', '1899-12-30T12:00:00.000Z', 60),
            ]),
        });
        spreadsheetApi.getRoomAwayTemperature.mockReturnValue(55);
        awayService.isEveryoneAwayFromRoom.mockReturnValue(false);
    });
    it('sets the temperature based on the most recent event from today', () => {
        expect.assertions(1);
        // Mock current time to Tuesday 11:00 AM
        MockDate.set('2019-11-26T11:00:00.000Z');
        resumeSchedule('office');
        expect(setTemp).toHaveBeenCalledWith('office', 55);
    });
    it('sets the temperature based on the most recent event if that was yesterday', () => {
        expect.assertions(1);
        // Mock current time to Wednesday 11:00 AM
        MockDate.set('2019-11-27T11:00:00.000Z');
        resumeSchedule('office');
        expect(setTemp).toHaveBeenCalledWith('office', 72);
    });
    it('sets the temperature based on the most recent event if that was 1 week ago', () => {
        expect.assertions(1);
        // Mock current time to Tuesday 9:00 AM
        MockDate.set('2019-11-26T09:00:00.000Z');
        resumeSchedule('office');
        expect(setTemp).toHaveBeenCalledWith('office', 72);
    });
    it('does nothing if no event is scheduled', () => {
        expect.assertions(1);
        spreadsheetApi.getSchedulesByRoomName.mockReturnValue({
            office: createMockScheduleSheet(),
        });
        resumeSchedule('office');
        expect(setTemp).not.toHaveBeenCalled();
    });
    it('sets the away temperatyre for empty rooms', () => {
        expect.assertions(1);
        awayService.isEveryoneAwayFromRoom.mockReturnValue(true);
        resumeSchedule('office');
        expect(setTemp).toHaveBeenCalledWith('office', 55);
    });
});
