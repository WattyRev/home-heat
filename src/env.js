/**
 * Fetches environment variables.
 * These variables are stored in a _env.js file outside of version control
 * because they provide access to sensitive data.
 */
export default function getEnv() {
    /* eslint-disable global-require */
    const env = require('./_env');
    return env;
}
