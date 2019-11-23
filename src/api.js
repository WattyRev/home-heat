/* eslint-disable no-unused-vars */
/* global ContentService, AppLib */

/**
 * NOTE Only App Script code allowed in this file.
 */
function doGet() {
    const output = AppLib.getTest();
    return ContentService.createTextOutput(output);
}
