import { getStatus } from '../../globals/Spreadsheet';
import { awayRooms } from '../../constants/rooms';
import setTemp from '../setTemp';
import setAway from '../setAway';

jest.mock('../../globals/Spreadsheet');
jest.mock('../setTemp');
jest.mock('../../util/log');

describe('setAway', () => {
    let mockSetAway;
    beforeEach(() => {
        mockSetAway = jest.fn();
        getStatus.mockReturnValue({
            setAway: mockSetAway,
        });
    });
    describe('setting to true', () => {
        it('sets away status to true', () => {
            expect.assertions(1);
            setAway(true);
            expect(mockSetAway).toHaveBeenCalledWith(true);
        });
        it('sets each away room to away temperature', () => {
            expect.assertions(awayRooms.length);
            setAway(true);
            awayRooms.forEach(room => {
                expect(setTemp).toHaveBeenCalledWith(room, 'away');
            });
        });
    });
    describe('setting to false', () => {
        it('throws an error', () => {
            expect.assertions(1);
            expect(() => setAway(false)).toThrow();
        });
    });
});
