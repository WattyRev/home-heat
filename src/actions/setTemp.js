import IftttEvent from '../models/IftttEvent';
import api from '../api/IftttWebhookApi';
import rooms from '../constants/rooms';
import temperatures from '../constants/temperatures';

export default function setTemp(roomName, temperature) {
    // Validation
    if (!rooms.includes(roomName)) {
        throw new Error(
            `${roomName} is not a valid room. Please provide one of: ${rooms.join(', ')}`
        );
    }
    if (!temperatures.includes(temperature)) {
        throw new Error(
            `${temperature} is not a valid temperature. Please provide one of: ${temperatures.join(
                ', '
            )}`
        );
    }

    // Action
    const event = new IftttEvent({
        roomName,
        temperature,
    });
    api.triggerEvent(event);
    return `Setting ${roomName} to ${temperature} temperature.`;
}