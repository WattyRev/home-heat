import getUrlFetchApp from '../globals/UrlFetchApp';
import log from '../util/log';
import { fullClimateRooms } from '../constants/rooms';
import { getScriptProperties } from '../globals/PropertiesService';
import spreadsheetApi from './SpreadsheetApi';

/**
 * Logic for communicating with Home Assistant
 */
export class HomeAssistantApi {
    get config() {
        return {
            /**
             * The base url for all API requests
             */
            baseURL: 'https://wattyha.duckdns.org:1111/api',
            options: {
                headers: { Authorization: `Bearer ${getScriptProperties().homeAssistantToken}` },
            },
        };
    }

    get thermostatsByRoom() {
        return {
            bathroom: 'climate.mysa_bathroom',
            bedroom: 'climate.mysa_bedroom',
            game_room: 'climate.mysa_game_room',
            guest_bathroom: 'climate.mysa_guest_bathroom',
            guest_room: 'climate.mysa_guest_room',
            living_room: 'climate.living_room_ac',
            office: 'climate.mysa_office',
        };
    }

    fetch(path, options) {
        const url = `${this.config.baseURL}${path}`;
        log(
            `Making request to ${url} with method ${options.method} and payload ${options.payload}`
        );
        return getUrlFetchApp().fetch(url, {
            ...this.config.options,
            ...options,
        });
    }

    post(path, payload, options = {}) {
        const config = {
            method: 'POST',
        };
        config.contentType = 'application/json';
        config.payload = JSON.stringify(payload);
        return this.fetch(path, {
            ...config,
            ...options,
        });
    }

    /**
     * Sets the temperature of a room
     * @param {String} room The name of a room
     * @param {Number} temperature The temperature (F) to set the room to
     */
    setTemperature(room, temperature) {
        const payload = {
            entity_id: this.thermostatsByRoom[room],
            temperature,
        };
        this.post('/services/climate/set_temperature', payload);

        /*
         * NOTE, I should be able to set hvac mode via the set_temperature
         * service, but that doesn't seem to work. So, I set the hvac mode
         * explicitely.
         */
        this.setHvacMode(room, temperature);
    }

    /**
     * Sets the hvac mode of the room based on the provided tmperature
     * @param {String} room The name of a room
     * @param {Number} temperature The temperature that the room is being set to
     */
    setHvacMode(room, temperature) {
        const payload = {
            entity_id: this.thermostatsByRoom[room],
        };
        if (!fullClimateRooms.includes(room)) {
            return;
        }
        if (temperature < spreadsheetApi.getMinimumComfortTemp()) {
            payload.hvac_mode = 'heat';
        } else {
            payload.hvac_mode = 'heat_cool';
        }
        this.post('/services/climate/set_hvac_mode', payload);
    }

    /**
     * Turns off climate control in a room
     * @param  {String} room The room to turn off
     */
    turnOff(room) {
        this.post('/services/climate/turn_off', {
            entity_id: this.thermostatsByRoom[room],
        });
    }
}

export default new HomeAssistantApi();
