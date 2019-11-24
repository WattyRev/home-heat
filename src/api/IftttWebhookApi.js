import getUrlFetchApp from '../globals/UrlFetchApp';
import log from '../util/log';
import { iftttWebhookKey } from '../env';

export class IftttWebhookApi {
    constructor() {
        this.config = {
            /**
             * The base url for all API requests
             */
            baseURL: 'https://maker.ifttt.com/trigger',
            options: {
                headers: {
                    Accept: 'application/json',
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
        return this.fetch(path, {
            method: 'POST',
            contentType: payload ? 'application/json' : undefined,
            payload: payload ? JSON.stringify(payload) : undefined,
            ...options,
        });
    }

    /**
     * Get the path string for making event requests.
     * @param  {String} event the name of the event
     * @return {String}       The path name to be hit
     */
    getEventPath(event) {
        return `/${event}/with/key/${iftttWebhookKey}`;
    }

    /**
     * Trigger an IFTTT webhook event.
     * @param  {IftttEvent} event the Event to trigger
     */
    triggerEvent(event) {
        const path = this.getEventPath(event.name);
        return this.post(path);
    }
}

export default new IftttWebhookApi();
