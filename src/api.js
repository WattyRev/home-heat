/* eslint-disable no-unused-vars */
/* global ContentService, AppLib */
/**
 * NOTE Only App Script code allowed in this file.
 */

/**
 * Handler for GET requests to the App Script
 */
function doGet(e) {
    const output = AppLib.onGet(e);
    return ContentService.createTextOutput(output);
}

/**
 * Handler for POST requests to the App Script
 */
function doPost(e) {
    AppLib.onPost(e);
    // Don't return anything from ContentService because that will result in a 302
    // https://developers.google.com/apps-script/guides/content#redirects
}

/**
 * Handler for timer events dispatched by Google Scripts
 */
function doTimedExecution(e) {
    AppLib.onTimedExecution(e);
}
