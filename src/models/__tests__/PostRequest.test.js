import { getScriptProperties } from '../../globals/PropertiesService';
import PostRequest from '../PostRequest';

jest.mock('../../globals/PropertiesService');

describe('PostRequest', () => {
    beforeEach(() => {
        getScriptProperties.mockReturnValue({
            passcode: 'super-secret',
        });
    });
    it('sets the action', () => {
        expect.assertions(1);
        const request = new PostRequest({
            parameter: {
                action: 'test',
            },
        });
        expect(request.action).toEqual('test');
    });
    it('sets the payload', () => {
        expect.assertions(1);
        const request = new PostRequest({
            parameter: {
                action: 'test',
            },
            postData: {
                type: 'application/json',
                contents: JSON.stringify({
                    passcode: 'super-secret',
                    foo: 'bar',
                }),
            },
        });
        expect(request.payload).toEqual({
            passcode: 'super-secret',
            foo: 'bar',
        });
    });
    it('throws an error if the payload does not inclue a valid passcode', () => {
        expect.assertions(1);
        expect(
            () =>
                new PostRequest({
                    parameter: {
                        action: 'test',
                    },
                    postData: {
                        type: 'application/json',
                        contents: JSON.stringify({
                            passcode: 'stuff',
                            foo: 'bar',
                        }),
                    },
                })
        ).toThrow();
    });
});
