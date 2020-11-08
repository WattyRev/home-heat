import spreadsheetApi from '../api/SpreadsheetApi';
import allArrayItemsInHaystack from '../util/allArrayItemsInHaystack';

class AwayService {
    isEveryoneAwayFromRoom(roomName) {
        const awayUsers = spreadsheetApi.getAway();
        const roomUsers = spreadsheetApi.getUsersForRoom(roomName);
        const allAway = allArrayItemsInHaystack(roomUsers, awayUsers);
        return allAway;
    }
}

export default new AwayService();
