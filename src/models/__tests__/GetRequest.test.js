import GetRequest from '../GetRequest';

describe('GetRequest', () => {
    it('exracts the action from the data', () => {
        expect.assertions(1);
        const request = new GetRequest({
            parameter: {
                action: 'foo',
                roomName: 'bar',
                temperature: 'far',
            },
        });
        expect(request.action).toEqual('foo');
    });
    it('extracts the roomName from the data', () => {
        expect.assertions(1);
        const request = new GetRequest({
            parameter: {
                action: 'foo',
                roomName: 'bar',
                temperature: 'far',
            },
        });
        expect(request.roomName).toEqual('bar');
    });
    it('extracts the temperature from the data', () => {
        expect.assertions(1);
        const request = new GetRequest({
            parameter: {
                action: 'foo',
                roomName: 'bar',
                temperature: 'far',
            },
        });
        expect(request.temperature).toEqual('far');
    });
});
