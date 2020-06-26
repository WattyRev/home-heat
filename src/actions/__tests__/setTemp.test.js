import api from '../../api/IftttWebhookApi';
import spreadsheetApi from '../../api/SpreadsheetApi';
import weatherApi from '../../api/WeatherApi';
import setTemp from '../setTemp';

jest.mock('../../api/IftttWebhookApi');
jest.mock('../../api/SpreadsheetApi');
jest.mock('../../util/log');
jest.mock('../../api/WeatherApi');

describe('setTemp', () => {
    beforeEach(() => {
        spreadsheetApi.getHold.mockReturnValue([]);
        spreadsheetApi.getWeatherOverrideTemp.mockReturnValue(75);
    });
    it('triggers an event on the API', () => {
        expect.assertions(3);
        setTemp('office', 'idle');
        expect(api.triggerEvent).toHaveBeenCalled();
        const callArg = api.triggerEvent.mock.calls[0][0];
        expect(callArg.roomName).toEqual('office');
        expect(callArg.temperature).toEqual('idle');
    });
    it('throws if an invalid room name is provided', () => {
        expect.assertions(1);
        expect(() => setTemp('ballroom', 'idle')).toThrow();
    });
    it('throws if an invalid temperature is provided', () => {
        expect.assertions(1);
        expect(() => setTemp('office', 'on-fire')).toThrow();
    });
    it('does not trigger an event on the API if the room is on hold', () => {
        expect.assertions(1);
        spreadsheetApi.getHold.mockReturnValue(['office']);
        setTemp('office', 'idle');
        expect(api.triggerEvent).not.toHaveBeenCalled();
    });
    it("does not trigger an event on the API if temperature is shower and it's been too hot outside", () => {
        expect.assertions(1);
        weatherApi.getRecentHighTemperature.mockReturnValue(76);
        setTemp('bathroom', 'shower');
        expect(api.triggerEvent).not.toHaveBeenCalled();
    });
    it('does trigger an event on the API if the temperature is shower and it has not been hot outside', () => {
        expect.assertions(1);
        weatherApi.getRecentHighTemperature.mockReturnValue(55);
        setTemp('bathroom', 'shower');
        expect(api.triggerEvent).toHaveBeenCalled();
    });
});
