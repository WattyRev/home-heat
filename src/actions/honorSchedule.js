import moment from 'moment';
import { schedulesByRoomName } from '../globals/Spreadsheet';
import log from '../util/log';
import roundToNearestTenMinutes from '../util/roundToNearestTenMinutes';

export default function honorSchedule() {
    // Get the current time rounded to the nearest 10 minutes.
    const currentTime = moment();
    const [currentMinutes, currentHours, currentDayIndex] = roundToNearestTenMinutes(
        parseInt(currentTime.format('m')),
        parseInt(currentTime.format('H')),
        parseInt(currentTime.format('d'))
    );

    log(
        `Checking for actions to take at ${currentHours}hours ${currentMinutes}minutes ${currentDayIndex}dayIndex`
    );

    const actions = determineActions(currentDayIndex, currentHours, currentMinutes);
    if (!actions.length) {
        return 'No actions to take at this time.';
    }

    const message = actions.reduce(
        (builtMessage, action) =>
            `${builtMessage}* Set ${action.roomName} to ${action.temperature}\n`,
        'Must take the following actions: \n'
    );
    return message;
}

export function determineActions(dayIndex, hours, minutes) {
    log(`Checking rooms: ${Object.keys(schedulesByRoomName).join(', ')}`);
    const actions = Object.keys(schedulesByRoomName).reduce((accumulatedActions, roomName) => {
        log(`Checking schedule for ${roomName}`);
        const schedule = schedulesByRoomName[roomName];

        // Get the data starting at row 3 (after the headings) and column {dayIndex}
        // Include 20 rows and 2 columns (time and temp).
        // Returns Range https://developers.google.com/apps-script/reference/spreadsheet/range.html
        const startingColumnForToday = dayIndex * 2 + 1;
        const relevantRange = schedule.getRange(3, startingColumnForToday, 20, 2);

        // Gets a rectangular array of values from the range
        const relevantRows = relevantRange.getValues();
        const relevantRow = relevantRows.find(row => {
            const time = row[0];
            const temperature = row[1];
            if (!time || !temperature) {
                return false;
            }
            const momentTime = moment(time);
            const scheduleHours = parseInt(momentTime.format('H'));
            const scheduleMinutes = parseInt(momentTime.format('m'));

            log(
                `Evaluating ${scheduleHours}hours ${scheduleMinutes}minutes for temp ${temperature}`
            );
            if (scheduleHours === hours && scheduleMinutes === minutes) {
                return true;
            }
            return false;
        });

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
