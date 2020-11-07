import homeAssistantApi from '../HomeAssistantApi';
import getUrlFetchApp from '../../globals/UrlFetchApp';
import { getScriptProperties } from '../../globals/PropertiesService';

jest.mock('../../util/log');
jest.mock('../../globals/UrlFetchApp');
jest.mock('../../globals/PropertiesService');

describe('homeAssistantApi', () => {
    let mockFetch;
    beforeEach(() => {
        getScriptProperties.mockReturnValue({
            homeAssistantToken: 'home_assistant_token',
        });
        mockFetch = jest.fn();
        getUrlFetchApp.mockReturnValue({
            fetch: mockFetch,
        });
    });
    describe('setTemperature', () => {
        it('makes a post request to Home Assistant for the correct room and temperature', () => {
            expect.assertions(1);
            homeAssistantApi.setTemperature('bathroom', 73);
            expect(mockFetch).toHaveBeenCalledWith(
                'https://wattyha.duckdns.org:1111/api/services/climate/set_temperature',
                {
                    contentType: 'application/json',
                    headers: { Authorization: 'Bearer home_assistant_token' },
                    method: 'POST',
                    payload: '{"entity_id":"climate.mysa_bathroom","temperature":73}',
                }
            );
        });
    });
    describe('turnOff', () => {
        it('makes a post request to Home Assistant for the correct room', () => {
            expect.assertions(1);
            homeAssistantApi.turnOff('bathroom');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://wattyha.duckdns.org:1111/api/services/climate/turn_off',
                {
                    contentType: 'application/json',
                    headers: { Authorization: 'Bearer home_assistant_token' },
                    method: 'POST',
                    payload: '{"entity_id":"climate.mysa_bathroom"}',
                }
            );
        });
    });
    describe('turnOn', () => {
        it('makes a post request to Home Assistant for the correct room', () => {
            expect.assertions(1);
            homeAssistantApi.turnOn('bathroom');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://wattyha.duckdns.org:1111/api/services/climate/turn_on',
                {
                    contentType: 'application/json',
                    headers: { Authorization: 'Bearer home_assistant_token' },
                    method: 'POST',
                    payload: '{"entity_id":"climate.mysa_bathroom"}',
                }
            );
        });
    });
});
