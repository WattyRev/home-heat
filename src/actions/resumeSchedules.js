import moment from 'moment';
import spreadsheetApi from '../api/SpreadsheetApi';
import rooms from '../constants/rooms';
import roundToNearestTenMinutes from '../util/roundToNearestTenMinutes';
import log from '../util/log';
import setTemp from './setTemp';

export default function resumeSchedules() {
    log('Resuming schedules');
    rooms.forEach(room => resumeSchedule(room));
}

export function resumeSchedule(roomName) {
    // Get the schedule
    const schedule = spreadsheetApi.getSchedulesByRoomName()[roomName];
    const mostRecentEvent = getMostRecentEvent(schedule);
    if (mostRecentEvent) {
        setTemp(roomName, parseInt(mostRecentEvent[1]) || null);
    }
}

function getMostRecentEvent(schedule) {
    // Get the current time information
    const currentMoment = moment();
    const [minutes, hours, dayIndex] = roundToNearestTenMinutes(
        parseInt(currentMoment.format('m')),
        parseInt(currentMoment.format('H')),
        parseInt(currentMoment.format('d'))
    );

    // Create an array of daily schedules sorted from today -> 6 days ago
    // If today is wednesday, the array should end up [7, 5, 3, 1, 13, 11, 9]
    const dayIndexes = [1, 3, 5, 7, 9, 11, 13];
    dayIndexes.sort((indexA, indexB) => {
        const todayIndex = dayIndex * 2 + 1;
        const AaboveB = -1;
        const BaboveA = 1;
        const AequalB = 0;
        if (indexA === todayIndex) {
            return AaboveB;
        }
        if (indexB === todayIndex) {
            return BaboveA;
        }
        const diffA = todayIndex - indexA;
        const diffB = todayIndex - indexB;
        if (diffA < 0 && diffB >= 0) {
            return BaboveA;
        }
        if (diffB < 0 && diffA >= 0) {
            return AaboveB;
        }
        if (todayIndex - indexA < todayIndex - indexB) {
            return AaboveB;
        }
        if (todayIndex - indexA > todayIndex - indexB) {
            return BaboveA;
        }
        return AequalB;
    });
    // Duplicate the current day at the end of the list so we can check for
    // events from a week ago at a later time than now.
    dayIndexes.push(dayIndexes[0]);
    const daySchedules = dayIndexes.map(index => schedule.getRange(3, index, 20, 2));

    // Find the most recent event that happened before now
    let relevantEvent = null;
    daySchedules.find((daySchedule, index) => {
        const events = daySchedule.getValues().filter(event => event[0] && event[1]);

        // sort events from latest to earliest
        events.sort((eventA, eventB) => {
            const AaboveB = -1;
            const BaboveA = 1;
            const AequalB = 0;
            const timeA = new Date(eventA[0]).getTime();
            const timeB = new Date(eventB[0]).getTime();
            if (timeA > timeB) {
                return AaboveB;
            }
            if (timeA < timeB) {
                return BaboveA;
            }
            return AequalB;
        });

        // If the event is not today (first item in array), then set the latest
        // event and stop the loop.
        if (index !== 0 && events[0]) {
            [relevantEvent] = events;
            return true;
        }

        // If the event is today, look for the most recent event before the current time
        const currentNumericTime = hours * 60 + minutes;
        const foundEvent = events.find(event => {
            const eventMoment = moment(event[0]);
            const eventNumericTime =
                parseInt(eventMoment.format('H')) * 60 + parseInt(eventMoment.format('m'));
            if (eventNumericTime < currentNumericTime) {
                return true;
            }
            return false;
        });

        // If we found an event, set it and stop the loop
        if (foundEvent) {
            relevantEvent = foundEvent;
            return true;
        }

        // Nothing found, continue to the previous day
        return false;
    });

    return relevantEvent;
}
