import api from '../../api/IftttWebhookApi';
import setTemp from '../setTemp';

jest.mock('../../api/IftttWebhookApi');

describe('setTemp', () => {
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
});
