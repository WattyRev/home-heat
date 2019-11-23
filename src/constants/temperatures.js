/**
 * The temperature values allowed. Actual numeric temperatures are stored in IFTTT
 * since Mysa and Sensibo don't allow variables in their IFTTT events.
 */
const temperatures = [
    // When no one is expected to be in the room. ~50F
    'away',
    // When no one is actively using the room, but someone could. ~60F
    'idle',
    // When someone is sleeping in the room. ~69F
    'sleep',
    // When someone is actively using the room. ~72F
    'comfort',
    // When someone is taking a shower in the room. ~85F
    'shower',
];

export default temperatures;
