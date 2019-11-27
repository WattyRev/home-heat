import anyArrayItemsInHaystack from '../anyArrayItemsInHaystack';

describe('anyArrayItemsInHaystack', () => {
    it('returns true if all needles are in the haystack', () => {
        expect.assertions(1);
        expect(anyArrayItemsInHaystack(['foo', 'bar'], ['foo', 'bar', 'boo'])).toEqual(true);
    });
    it('returns true if some needles are in the haystack and others are not', () => {
        expect.assertions(1);
        expect(anyArrayItemsInHaystack(['foo', 'far'], ['foo', 'bar', 'boo'])).toEqual(true);
    });
    it('returns false if there are no needles', () => {
        expect.assertions(1);
        expect(anyArrayItemsInHaystack([], ['foo', 'bar', 'boo'])).toEqual(false);
    });
    it('returns false if there is no hay', () => {
        expect.assertions(1);
        expect(anyArrayItemsInHaystack(['foo', 'bar'], [])).toEqual(false);
    });
});
