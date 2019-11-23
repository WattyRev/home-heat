import UrlFetchApp from '../util/UrlFetchApp';
import { iftttWebhookKey } from '../env';

export default class IftttWebhookApi {
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

    fetch(path, options) {
        return UrlFetchApp.fetch(`${this.config.baseURL}${path}`, {
            ...this.config.options,
            ...options,
        });
    }

    get(path, options) {
        return this.fetch(path, options);
    }

    post(path, payload, options) {
        return this.fetch(path, {
            method: 'post',
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
        return path;
        // return this.get(path);
    }
}
