import roundToNearestTenMinutes from '../roundToNearestTenMinutes';

describe('roundToNearestTenMinutes', () => {
    it('rounds to the next 10 minute', () => {
        expect.assertions(1);
        const [roundedMinutes] = roundToNearestTenMinutes(16);
        expect(roundedMinutes).toEqual(20);
    });
    it('rounds to the previous 10 minute', () => {
        expect.assertions(1);
        const [roundedMinutes] = roundToNearestTenMinutes(14);
        expect(roundedMinutes).toEqual(10);
    });
    it('rounds to the next hour if necessary', () => {
        expect.assertions(2);
        const [roundedMinutes, roundedHours] = roundToNearestTenMinutes(56, 1);
        expect(roundedMinutes).toEqual(0);
        expect(roundedHours).toEqual(2);
    });
    it('does not round to the next hour if it is not necessary', () => {
        expect.assertions(2);
        const [roundedMinutes, roundedHours] = roundToNearestTenMinutes(54, 1);
        expect(roundedMinutes).toEqual(50);
        expect(roundedHours).toEqual(1);
    });
    it('rounds to the next day if necessary', () => {
        expect.assertions(3);
        const [roundedMinutes, roundedHours, roundedDay] = roundToNearestTenMinutes(56, 23, 1);
        expect(roundedMinutes).toEqual(0);
        expect(roundedHours).toEqual(0);
        expect(roundedDay).toEqual(2);
    });
    it('does not round to the next day if it is not necessary', () => {
        expect.assertions(3);
        const [roundedMinutes, roundedHours, roundedDay] = roundToNearestTenMinutes(54, 23, 1);
        expect(roundedMinutes).toEqual(50);
        expect(roundedHours).toEqual(23);
        expect(roundedDay).toEqual(1);
    });
    it('rounds day to 0 if it overflows the week', () => {
        expect.assertions(3);
        const [roundedMinutes, roundedHours, roundedDay] = roundToNearestTenMinutes(56, 23, 6);
        expect(roundedMinutes).toEqual(0);
        expect(roundedHours).toEqual(0);
        expect(roundedDay).toEqual(0);
    });
});
