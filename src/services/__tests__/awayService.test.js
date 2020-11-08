import spreadsheetApi from '../../api/SpreadsheetApi';
import awayService from '../awayService';

jest.mock('../../api/SpreadsheetApi');

describe('AwayService', () => {
    beforeEach(() => {
        spreadsheetApi.getAway.mockReturnValue(['spencer', 'michael']);
        spreadsheetApi.getUsersForRoom.mockReturnValue(['spencer', 'michael']);
    });
    describe('isEveryoneAwayFromRoom', () => {
        it('returns true if all users that use a room are away', () => {
            expect.assertions(1);
            expect(awayService.isEveryoneAwayFromRoom('living_room')).toEqual(true);
        });
        it('returns false if some users that use a room are away', () => {
            expect.assertions(1);
            spreadsheetApi.getAway.mockReturnValue(['spencer']);
            expect(awayService.isEveryoneAwayFromRoom('living_room')).toEqual(false);
        });
        it('returns false if no users that use a room are away', () => {
            expect.assertions(1);
            spreadsheetApi.getAway.mockReturnValue([]);
            expect(awayService.isEveryoneAwayFromRoom('living_room')).toEqual(false);
        });
    });
});
