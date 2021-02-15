import homeAssistantApi from '../HomeAssistantApi';
import getUrlFetchApp from '../../globals/UrlFetchApp';
import { getScriptProperties } from '../../globals/PropertiesService';
import spreadsheetApi from '../SpreadsheetApi';

jest.mock('../../util/log');
jest.mock('../../globals/UrlFetchApp');
jest.mock('../../globals/PropertiesService');
jest.mock('../SpreadsheetApi');

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
        describe('for full climate rooms', () => {
            beforeEach(() => {
                spreadsheetApi.getMinimumComfortTemp.mockReturnValue(68);
            });
            it('sets the temperature and the hvac mode to heat if the temperature is below the minimum comfort temperature', () => {
                expect.assertions(1);
                homeAssistantApi.setTemperature('living_room', 55);
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://wattyha.duckdns.org:1111/api/services/climate/set_temperature',
                    {
                        contentType: 'application/json',
                        headers: { Authorization: 'Bearer home_assistant_token' },
                        method: 'POST',
                        payload:
                            '{"entity_id":"climate.living_room_ac","hvac_mode":"heat","temperature":55}',
                    }
                );
            });
            it('sets the hvac mode to heat_cool and sets the target temp range if the temperature is not below the minimum comfort temperature', () => {
                expect.assertions(1);
                homeAssistantApi.setTemperature('living_room', 72);
                expect(mockFetch).toHaveBeenCalledWith(
                    'https://wattyha.duckdns.org:1111/api/services/climate/set_temperature',
                    {
                        contentType: 'application/json',
                        headers: { Authorization: 'Bearer home_assistant_token' },
                        method: 'POST',
                        payload:
                            '{"entity_id":"climate.living_room_ac","hvac_mode":"heat_cool","target_temp_high":73,"target_temp_low":71}',
                    }
                );
            });
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
});
