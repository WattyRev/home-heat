const fs = require('fs');

if (fs.existsSync('./src/_env.js')) {
    console.log('_env.js already exists. Leaving it alone');
} else {
    const fileContents = `
const iftttWebhookKey = "${process.env.IFTTT_WEBHOOK_KEY}";
const passcode = '${process.env.PASSCODE}'

export {
    iftttWebhookKey,
    passcode
};
`;
    fs.writeFileSync('./src/_env.js', fileContents);
}

if (fs.existsSync('./creds.json')) {
    console.log('creds.json already exists. Leaving it alone');
} else if (process.env.APP_SCRIPT_CREDS) {
    fs.writeFileSync('./creds.json', process.env.APP_SCRIPT_CREDS);
}

if (fs.existsSync('./clasprc.json')) {
    console.log('clasprc.json already exists. Leaving it alone');
} else if (process.env.CLASPRC) {
    fs.writeFileSync('./clasprc.json', process.env.CLASPRC);
}
