import axios from 'axios';
import { iftttWebhookKey } from '../env';

export class CompetitionApi {
    constructor() {
        this.config = {
            baseURL: this.baseUrl,
            headers: {
                Accept: 'application/json',
            },
        };

        this.axiosInstance = axios.create(this.config);
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
     * The base url for all API requests
     * @type {String}
     */
    baseUrl = 'https://maker.ifttt.com/trigger';

    /**
     * The axios configuration.
     * @type {Object}
     */
    config = {};

    /**
     * The axios instance.
     * @type {Axios}
     */
    axiosInstance = null;

    /**
     * Trigger an IFTTT webhook event.
     * @param  {IftttEvent} event the Event to trigger
     * @return {Promise}
     */
    async triggerEvent(event) {
        const path = this.getEventPath(event.get('name'));
        await this.axiosInstance.get(path);
    }
}
