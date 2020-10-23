import getUrlFetchApp from '../globals/UrlFetchApp';
import log from '../util/log';
import { getScriptProperties } from '../globals/PropertiesService';

export class HomeAssistantApi {
    constructor() {
        this.config = {
            /**
             * The base url for all API requests
             */
            baseURL: 'http://wattyha.duckdns.org:1111/api',
            options: {
                headers: {
                    'Authorization': `Bearer ${getScriptProperties().homeAssistantToken}`,
                    'Content-Type': 'application/json',
                },
            },
        };
    }

    fetch(path, options = {}) {
        const url = `${this.config.baseURL}${path}`;
        log(`Making request to ${url} with method ${options.method || 'GET'}`);
        return getUrlFetchApp().fetch(url, {
            ...this.config.options,
            ...options,
        });
    }

    get(path, options = {}) {
        return this.fetch(path, options);
    }

    post(path, payload, options = {}) {
        const config = {
            method: 'POST',
        };
        if (payload) {
            config.contentType = 'application/json';
            config.payload = JSON.stringify(payload);
        }
        return this.fetch(path, {
            ...config,
            ...options,
        });
    }

    setTemperature(room, temperature) {
        const thermostatsByRoom = {
            bathroom: 'climate.mysa_bathroom',
            bedroom: 'climate.mysa_bedroom',
            game_room: 'climate.mysa_game_room',
            guest_bathroom: 'climate.mysa_guest_bathroom',
            guest_bedroom: 'climate.mysa_guest_bedroom',
            living_room: 'climate.living_room_ac',
            office: 'climate.mysa_office',
        };
        this.post('/services/climate/set_temperature', {
            entity_id: thermostatsByRoom[room],
            temperature,
        });
    }
}

export default new HomeAssistantApi();
