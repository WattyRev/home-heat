import moment from 'moment';
import { getScriptProperties } from '../../globals/PropertiesService';
import getUrlFetchApp from '../../globals/UrlFetchApp';
import weatherApi from '../WeatherApi';
import mockWeatherResponse from '../../../testUtils/mockWeatherResponse';

jest.mock('../../globals/UrlFetchApp');
jest.mock('../../globals/PropertiesService');
jest.mock('../../util/log');

describe('WeatherAPI', () => {
    beforeEach(() => {
        getScriptProperties.mockReturnValue({
            weatherMapApiKey: 'api-key',
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
            const beginningOfDay = Math.floor(
                moment()
                    .set('hours', 0)
                    .set('minutes', 0)
                    .set('seconds', 0)
                    .toDate()
                    .getTime() / 1000
            );
            weatherApi.getRecentHighTemperature();
            expect(
                fetch
            ).toHaveBeenCalledWith(
                `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=47.450249&lon=-122.308815&dt=${beginningOfDay}&appid=api-key&units=imperial`,
                { method: 'get' }
            );
        });
    });
});
