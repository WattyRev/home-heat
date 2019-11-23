import PropTypes from 'prop-types';
import { computed, createModel } from 'manikin-model';

const GetRequest = createModel({
    parameter: null,
    action: computed(function() {
        return this.get('parameter').action;
    }),
    room: computed(function() {
        return this.get('parameter').room;
    }),
    temperature: computed(function() {
        return this.get('parameter').temperature;
    }),
});

GetRequest.prototype.propTypes = {
    parameter: PropTypes.objectOf(PropTypes.string),
};

export default GetRequest;

export function transformGetRequest(data) {
    return new GetRequest({
        parameter: data.parameter,
    });
}
