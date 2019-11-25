const rooms = [
    'living_room',
    'bedroom',
    'office',
    'bathroom',
    'game_room',
    'guest_room',
    'guest_bathroom',
];
export default rooms;

/**
 * Rooms that only Spencer uses
 */
export const spencerRooms = ['bedroom', 'office', 'bathroom'];

/**
 * Rooms that only Michael uses
 */
export const michaelRooms = ['guest_room', 'guest_bathroom'];

/**
 * Rooms that everyone use
 * @type {Array}
 */
export const commonRooms = ['living_room', 'game_room'];
