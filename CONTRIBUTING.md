## Local Development

Install dependencies for local development using:
```
npm ci
```

## Deployment


1. Authenticate with App Scripts using (only needed on clean install):
```
npm run authenticate
```

3. Create `src/_env.js` from the contents stored in LastPass called HomeHeat Secrets (only needed on clean install)

2. Push code to Google by using:
```
npm run deploy
```

3. Publish the web-app from the script [here](https://script.google.com/d/10rdOYPj5eix6kF7VkjrmR8LDWrHty8pLn0kW5yhmMm_A5pdr8S-RUWxR/edit?usp=drive_web).

    1. Select Publish -> Deploy as web app...
    2. Set Project version to "New"
    3. Set Who has access to the app to "Anyone, even anonymous"
    4. Press "Update"
