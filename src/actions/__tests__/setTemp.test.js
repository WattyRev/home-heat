import homeAssistantApi from '../../api/HomeAssistantApi';
import spreadsheetApi from '../../api/SpreadsheetApi';
import weatherApi from '../../api/WeatherApi';
import setTemp from '../setTemp';

jest.mock('../../api/HomeAssistantApi');
jest.mock('../../api/SpreadsheetApi');
jest.mock('../../util/log');
jest.mock('../../api/WeatherApi');

describe('setTemp', () => {
    beforeEach(() => {
        spreadsheetApi.getHold.mockReturnValue([]);
        spreadsheetApi.getWeatherOverrideTemp.mockReturnValue(75);
    });
    it('sets the temperature through Home Assistant', () => {
        expect.assertions(1);
        setTemp('office', 60);
        expect(homeAssistantApi.setTemperature).toHaveBeenCalledWith('office', 60);
    });
    it('throws if an invalid room name is provided', () => {
        expect.assertions(1);
        expect(() => setTemp('ballroom', 60)).toThrow();
    });
    it('does not set the temperature through Home Assistant if the room is on hold', () => {
        expect.assertions(1);
        spreadsheetApi.getHold.mockReturnValue(['office']);
        setTemp('office', 60);
        expect(homeAssistantApi.setTemperature).not.toHaveBeenCalled();
    });
    it("does not set the temperature through Home Assistant if temperature is shower and it's been too hot outside", () => {
        expect.assertions(1);
        weatherApi.getRecentHighTemperature.mockReturnValue(76);
        setTemp('bathroom', 80);
        expect(homeAssistantApi.setTemperature).not.toHaveBeenCalled();
    });
    it('does set the temperature through Home Assistant if the temperature is shower and it has not been hot outside', () => {
        expect.assertions(1);
        weatherApi.getRecentHighTemperature.mockReturnValue(55);
        setTemp('bathroom', 80);
        expect(homeAssistantApi.setTemperature).toHaveBeenCalled();
    });
    it('turns off the thermostat if temperature is null', () => {
        expect.assertions(1);
        setTemp('office', null);
        expect(homeAssistantApi.turnOff).toHaveBeenCalledWith('office');
    });
    it('turns on the thermostat if the room has full climate control', () => {
        expect.assertions(1);
        setTemp('living_room', 72);
        expect(homeAssistantApi.turnOn).toHaveBeenCalledWith('living_room');
    });
});
