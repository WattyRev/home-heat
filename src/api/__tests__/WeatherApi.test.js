import moment from 'moment';
import { getScriptProperties } from '../../globals/PropertiesService';
import getUrlFetchApp from '../../globals/UrlFetchApp';
import weatherApi from '../WeatherApi';
import mockWeatherResponse from '../../../testUtils/mockWeatherResponse';

jest.mock('../../globals/UrlFetchApp');
jest.mock('../../globals/PropertiesService');
jest.mock('../../util/log');
jest.mock('moment');

describe('WeatherAPI', () => {
    beforeEach(() => {
        getScriptProperties.mockReturnValue({
            weatherMapApiKey: 'api-key',
        });
        moment.mockImplementation(dateTime => {
            if (!dateTime) {
                const momentObj = {
                    date: jest.fn(() => 25),
                    set: jest.fn(),
                    toDate: jest.fn(() => new Date('2020-06-25 00:00:00 GMT-0700')),
                };
                momentObj.set = jest.fn(() => momentObj);
                return momentObj;
            }
            return {
                date: jest.fn(() => dateTime.getDate()),
                format: jest.fn(),
            };
        });
    });
    describe('getRecentHighTemperature', () => {
        let fetch;
        beforeEach(() => {
            fetch = jest.fn().mockReturnValue({
                getContentText: jest.fn(() => JSON.stringify(mockWeatherResponse)),
            });
            getUrlFetchApp.mockReturnValue({
                fetch,
            });
        });

        it('returns the highest temperature', () => {
            expect.assertions(1);
            expect(weatherApi.getRecentHighTemperature()).toEqual(78.04);
        });

        it('makes a request to the appropriate URL', () => {
            expect.assertions(1);
            weatherApi.getRecentHighTemperature();
            expect(
                fetch
            ).toHaveBeenCalledWith(
                `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=47.450249&lon=-122.308815&dt=1593068400&appid=api-key&units=imperial`,
                { method: 'get' }
            );
        });

        it('does not select high temperatures from yesterday', () => {
            expect.assertions(1);
            fetch.mockReturnValue({
                getContentText: jest.fn(() =>
                    JSON.stringify({
                        ...mockWeatherResponse,
                        hourly: [
                            {
                                dt: 1593043200,
                                temp: 1000.79,
                            },
                            ...mockWeatherResponse.hourly,
                        ],
                    })
                ),
            });
            expect(weatherApi.getRecentHighTemperature()).toEqual(78.04);
        });
    });
});
