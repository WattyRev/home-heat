import allArrayItemsInHaystack from '../allArrayItemsInHaystack';

describe('allArrayItemsInHaystack', () => {
    it('returns true if all needles are in the haystack', () => {
        expect.assertions(1);
        expect(allArrayItemsInHaystack(['foo', 'bar'], ['foo', 'bar', 'boo'])).toEqual(true);
    });
    it('returns false if one needls is not in the haystack', () => {
        expect.assertions(1);
        expect(allArrayItemsInHaystack(['foo', 'far'], ['foo', 'bar', 'boo'])).toEqual(false);
    });
    it('returns true if there are no needles', () => {
        expect.assertions(1);
        expect(allArrayItemsInHaystack([], ['foo', 'bar', 'boo'])).toEqual(true);
    });
    it('returns false if there is no hay', () => {
        expect.assertions(1);
        expect(allArrayItemsInHaystack(['foo', 'bar'], [])).toEqual(false);
    });
});
