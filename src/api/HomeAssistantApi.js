import getUrlFetchApp from '../globals/UrlFetchApp';
import log from '../util/log';
import { getScriptProperties } from '../globals/PropertiesService';

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
            // AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSMmuteHttpExceptions: true,
        };
    }

    get thermostatsByRoom() {
        return {
            bathroom: 'climate.mysa_bathroom',
            bedroom: 'climate.mysa_bedroom',
            game_room: 'climate.mysa_game_room',
            guest_bathroom: 'climate.mysa_guest_bathroom',
            guest_room: 'climate.mysa_guest_bedroom',
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
        this.post('/services/climate/set_temperature', {
            entity_id: this.thermostatsByRoom[room],
            temperature,
        });
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

    /**
     * Turns on climate control in a room
     * @param  {String} room The room to turn on
     */
    turnOn(room) {
        this.post('/services/climate/turn_on', {
            entity_id: this.thermostatsByRoom[room],
        });
    }
}

export default new HomeAssistantApi();
