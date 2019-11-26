import getUrlFetchApp from '../../globals/UrlFetchApp';
import IftttEvent from '../../models/IftttEvent';
import { getScriptProperties } from '../../globals/PropertiesService';
import api from '../IftttWebhookApi';

jest.mock('../../globals/PropertiesService');
jest.mock('../../globals/UrlFetchApp');
jest.mock('../../util/log');

describe('IftttWebhookApi', () => {
    let mockFetch;
    beforeEach(() => {
        mockFetch = jest.fn();
        getUrlFetchApp.mockReturnValue({
            fetch: mockFetch,
        });
        getScriptProperties.mockReturnValue({
            iftttWebhookKey: 'my-key',
        });
    });
    describe('triggerEvent', () => {
        it('makes a post request to the correct url', () => {
            expect.assertions(1);
            api.triggerEvent(
                new IftttEvent({
                    roomName: 'office',
                    temperature: 'idle',
                })
            );
            expect(mockFetch).toHaveBeenCalledWith(
                'https://maker.ifttt.com/trigger/set_office_temp_idle/with/key/my-key',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
        });
    });
});
