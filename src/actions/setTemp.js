import weatherApi from '../api/WeatherApi';
import homeAssistantApi from '../api/HomeAssistantApi';
import rooms from '../constants/rooms';
import spreadsheetApi from '../api/SpreadsheetApi';
import log from '../util/log';

export default function setTemp(roomName, temperature) {
    // Validation
    if (!rooms.includes(roomName)) {
        throw new Error(
            `${roomName} is not a valid room. Please provide one of: ${rooms.join(', ')}`
        );
    }
    // Prevent setting temperature if room is on hold
    if (spreadsheetApi.getHold().includes(roomName)) {
        log(`Skipped setting ${roomName} to ${temperature} because the room is on hold.`);
        return;
    }
    // Prevent setting high temperature if it has been hot outside
    // TODO change to reference thermostat temperature instead of weather
    if (temperature > 75) {
        const overrideTemp = spreadsheetApi.getWeatherOverrideTemp();
        const recentHighTemp = weatherApi.getRecentHighTemperature();
        if (overrideTemp <= recentHighTemp) {
            log(
                `Skipped setting ${roomName} to ${temperature} because the recent high temperature is over ${overrideTemp} degrees.`
            );
            return;
        }
    }
    if (temperature === null) {
        homeAssistantApi.turnOff(roomName);
        return;
    }
    homeAssistantApi.setTemperature(roomName, temperature);
}
