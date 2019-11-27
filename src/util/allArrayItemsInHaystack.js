/**
 * Search for each needle in haystack.
 * @param  {[]} needles Items to search for in haystack
 * @param  {[]} haystack
 * @return {Boolean} True of all needles are found in haystack
 */
export default function allArrayItemsInHaystack(needles, haystack) {
    return needles.reduce((accumulatedBool, needle) => {
        if (!accumulatedBool) {
            return false;
        }
        if (!haystack.includes(needle)) {
            return false;
        }
        return true;
    }, true);
}
