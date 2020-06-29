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
                    toDate: jest.fn(() => new Date('2020-06-25 22:00:00 GMT-0700')),
                };
                momentObj.set = jest.fn(() => ({
                    ...momentObj,
                    toDate: jest.fn(() => new Date('2020-06-25 00:00:00 GMT-0700')),
                }));
                return momentObj;
            }
            return {
                date: jest.fn(() => dateTime.getDate()),
                format: jest.fn(),
            };
        });
    });
    describe('getRecentHighTemperature', () => {
        let getRequest;
        let fetchAll;
        beforeEach(() => {
            getRequest = jest.fn(() => 'test');
            jest.fn().mockReturnValue({
                getContentText: jest.fn(() => JSON.stringify(mockWeatherResponse)),
            });
            fetchAll = jest.fn(() => [
                {
                    getContentText: jest.fn(() => JSON.stringify(mockWeatherResponse)),
                },
                {
                    getContentText: jest.fn(() => JSON.stringify(mockWeatherResponse)),
                },
            ]);
            getUrlFetchApp.mockReturnValue({
                getRequest,
                fetchAll,
            });
        });

        it('returns the highest temperature', () => {
            expect.assertions(1);
            expect(weatherApi.getRecentHighTemperature()).toEqual(78.04);
        });

        it('makes requests to the appropriate URLs', () => {
            expect.assertions(2);
            weatherApi.getRecentHighTemperature();
            expect(
                getRequest
            ).toHaveBeenCalledWith(
                `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=47.450249&lon=-122.308815&dt=1593147600&appid=api-key&units=imperial`,
                { method: 'get' }
            );
            expect(
                getRequest
            ).toHaveBeenCalledWith(
                `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=47.450249&lon=-122.308815&dt=1593068400&appid=api-key&units=imperial`,
                { method: 'get' }
            );
        });

        it('does not select high temperatures from yesterday', () => {
            expect.assertions(1);
            fetchAll.mockReturnValue([
                {
                    getContentText: jest.fn(() =>
                        JSON.stringify({
                            ...mockWeatherResponse,
                            hourly: [
                                {
                                    dt: 1592973200,
                                    temp: 1000.79,
                                },
                                ...mockWeatherResponse.hourly,
                            ],
                        })
                    ),
                },
                {
                    getContentText: jest.fn(() => JSON.stringify(mockWeatherResponse)),
                },
            ]);
            expect(weatherApi.getRecentHighTemperature()).toEqual(78.04);
        });
    });
});
