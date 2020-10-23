/* globals PropertiesService */
/**
 * See documentation on Properties Service:
 * https://developers.google.com/apps-script/reference/properties/properties-service.html
 * Fetches script properties which are stored in Google Scripts and hold API keys and stuff.
 * Provides:
 * iftttWebhookKey
 * passcode
 * homeAssistantToken
 */
export function getScriptProperties() {
    return PropertiesService.getScriptProperties().getProperties();
}
