import PropTypes from 'prop-types';
import { computed, createModel } from 'manikin-model';
import rooms from '../constants/rooms';
import temperatures from '../constants/temperatures';

const IftttEvent = createModel({
    roomName: null,
    temperature: null,
    name: computed(function() {
        return `set_${this.get('roomName')}_temp_${this.get('temperature')}`;
    }),
});

IftttEvent.prototype.propTypes = {
    roomName: PropTypes.oneOf(rooms).isRequired,
    temperature: PropTypes.oneOf(temperatures).isRequired,
    name: PropTypes.string,
};

export default IftttEvent;
