import moment from 'moment';
import log from '../util/log';
import getUrlFetchApp from '../globals/UrlFetchApp';
import { getScriptProperties } from '../globals/PropertiesService';

// Openweathermap https://openweathermap.org/api/

// Lat/Long of SeaTac, WA
const LATITUDE = 47.450249;
const LONGITUDE = -122.308815;

export class WeatherApi {
    constructor() {
        this.config = {
            baseURL: 'https://api.openweathermap.org/data/2.5/onecall',
        };
    }

    // Get the high temperature for the last 24 hours
    getRecentHighTemperature() {
        // Get the API key
        const { weatherMapApiKey } = getScriptProperties();

        // The weather API returns hourly data from 00:00 to 23:00 UTC time
        // based on the date provided, so in order to get all the hourly data
        // for today, I need to make 2 requests
        const currentTimestamp = Math.floor(
            moment()
                .toDate()
                .getTime() / 1000
        );
        // Use the time from the beginning of the day.
        // The API takes the time in seconds
        const beginningOfDayTimestamp = Math.floor(
            moment()
                .set('hours', 0)
                .set('minutes', 0)
                .set('seconds', 0)
                .toDate()
                .getTime() / 1000
        );

        // Make the requests
        const currentRequest = getUrlFetchApp().getRequest(
            `${this.config.baseURL}/timemachine?lat=${LATITUDE}&lon=${LONGITUDE}&dt=${currentTimestamp}&appid=${weatherMapApiKey}&units=imperial`,
            {
                method: 'get',
            }
        );
        const beginningOfDayRequest = getUrlFetchApp().getRequest(
            `${this.config.baseURL}/timemachine?lat=${LATITUDE}&lon=${LONGITUDE}&dt=${beginningOfDayTimestamp}&appid=${weatherMapApiKey}&units=imperial`,
            {
                method: 'get',
            }
        );
        const responses = getUrlFetchApp().fetchAll([currentRequest, beginningOfDayRequest]);

        // Parse the response as JSON
        const hourly = [
            ...JSON.parse(responses[0].getContentText()).hourly,
            ...JSON.parse(responses[1].getContentText()).hourly,
        ];

        // Loop through the hourly data looking for the high temperature
        const todaysDate = moment().date();
        const highestItem = hourly.reduce(
            (currentHigh, hourlyData) => {
                // Exclude any data that isn't from today
                const date = moment(new Date(hourlyData.dt * 1000)).date();
                if (todaysDate !== date) {
                    return currentHigh;
                }
                if (hourlyData.temp < currentHigh.temp) {
                    return currentHigh;
                }
                return hourlyData;
            },
            { temp: 0, dt: 0 }
        );
        log(
            `Highest recent temp is ${highestItem.temp}F at ${moment(
                new Date(highestItem.dt * 1000)
            ).format('YYYY-MM-DD HH:MM')}`
        );
        return highestItem.temp;
    }
}

export default new WeatherApi();
