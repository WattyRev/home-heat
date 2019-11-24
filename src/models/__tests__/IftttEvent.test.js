import IftttEvent from '../IftttEvent';

describe('IftttEvent', () => {
    it('generates an event name', () => {
        expect.assertions(1);
        const event = new IftttEvent({
            roomName: 'office',
            temperature: 'idle',
        });
        expect(event.name).toEqual('set_office_temp_idle');
    });
});
