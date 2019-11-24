import moment from 'moment';
import { getSchedulesByRoomName, getStatus } from '../globals/Spreadsheet';
import { awayRooms } from '../constants/rooms';
import roundToNearestTenMinutes from '../util/roundToNearestTenMinutes';
import log from '../util/log';
import setTemp from './setTemp';

/**
 * Set thermostats based on current time and the defined schedules.
 * Operates in increments of 10 minutes.
 */
export default function honorSchedule() {
    // Get the current time rounded to the nearest 10 minutes.
    const currentTime = moment();
    const [currentMinutes, currentHours, currentDayIndex] = roundToNearestTenMinutes(
        parseInt(currentTime.format('m')),
        parseInt(currentTime.format('H')),
        parseInt(currentTime.format('d'))
    );

    // Determine what actions need to be taken
    const actions = determineActions(currentDayIndex, currentHours, currentMinutes);

    // Notify that no action is taken
    if (!actions.length) {
        return 'No actions to take at this time.';
    }

    // Execute each action
    log('Taking scheduled action');
    actions.forEach(action => {
        setTemp(action.roomName, action.temperature);
    });

    // Report on actions taken
    const message = actions.reduce(
        (builtMessage, action) =>
            `${builtMessage}* Set ${action.roomName} to ${action.temperature}\n`,
        'Took the following actions:\n'
    );
    return message;
}

/**
 * Datermine what actions should be taken given the day, hour, and minute.
 * @param  {Number} dayIndex The index of the day of week (0-6) where 0 is Sunday
 * @param  {Number} hours    The number of hours elapsed in the day (0-23)
 * @param  {Number} minutes  The number of minutes elapsed in the hour (0-59)
 * @return {Object[]}        A list of actions to take. Each action includes
 *                           room name and temperature.
 */
export function determineActions(dayIndex, hours, minutes) {
    const status = getStatus();
    // During vacation, leave thermostats alone
    if (status.isVacation) {
        return [];
    }
    const schedulesByRoomName = getSchedulesByRoomName();
    const actions = Object.keys(schedulesByRoomName).reduce((accumulatedActions, roomName) => {
        // If this room is currently impacted by away status, don't do anything to it.
        if (status.isAway && awayRooms.includes(roomName)) {
            return accumulatedActions;
        }

        const schedule = schedulesByRoomName[roomName];

        // Get the data starting at row 3 (after the headings) and column {dayIndex}
        // Include 20 rows and 2 columns (time and temp).
        // Returns Range https://developers.google.com/apps-script/reference/spreadsheet/range.html
        const startingColumnForToday = dayIndex * 2 + 1;
        const relevantRange = schedule.getRange(3, startingColumnForToday, 20, 2);

        // Gets a rectangular array of values from the range
        const relevantRows = relevantRange.getValues();

        // Find a relevant row
        const relevantRow = relevantRows.find(row => {
            // The time returns in a format like "1899-12-30T17:30:00.000Z"
            const time = row[0];
            // Temperature is one of the temperature values (idle, comfort, etc)
            const temperature = row[1];

            // If there's no time or temp, skip this row
            if (!time || !temperature) {
                return false;
            }

            // Evaluate the time
            const momentTime = moment(time);
            const scheduleHours = parseInt(momentTime.format('H'));
            const scheduleMinutes = parseInt(momentTime.format('m'));

            // Use this row if the time matches the requested time
            if (scheduleHours === hours && scheduleMinutes === minutes) {
                return true;
            }
            return false;
        });

        // Add the relevant row data to the actions list if one exists
        if (relevantRow) {
            accumulatedActions.push({
                roomName,
                temperature: relevantRow[1],
            });
        }

        return accumulatedActions;
    }, []);
    return actions;
}
