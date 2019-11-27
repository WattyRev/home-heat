/**
 * Search for each needle in haystack.
 * @param  {[]} needles Items to search for in haystack
 * @param  {[]} haystack
 * @return {Boolean} True of any needles are found in haystack
 */
export default function anyArrayItemsInHaystack(needles, haystack) {
    return needles.reduce((accumulatedBool, needle) => {
        if (accumulatedBool) {
            return true;
        }
        if (haystack.includes(needle)) {
            return true;
        }
        return false;
    }, false);
}
