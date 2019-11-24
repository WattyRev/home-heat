import moment from 'moment';
import { schedulesByRoomName } from '../globals/Spreadsheet';
import roundToNearestTenMinutes from '../util/roundToNearestTenMinutes';
import setTemp from './setTemp';

export default function resumeSchedule(roomName) {
    // Get the schedule
    const schedule = schedulesByRoomName[roomName];
    const mostRecentEvent = getMostRecentEvent(schedule);
    setTemp(roomName, mostRecentEvent[1]);
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
        if (todayIndex - indexA > todayIndex - indexB) {
            return AaboveB;
        }
        if (todayIndex - indexA < todayIndex - indexB) {
            return BaboveA;
        }
        return AequalB;
    });
    const daySchedules = dayIndexes.map(index => schedule.getRange(3, index, 20, 2));
    // Duplicate the current day at the end of the list so we can check for
    // events from a week ago at a later time than now.
    daySchedules.push(daySchedules[0]);

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
        if (index !== 0) {
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
