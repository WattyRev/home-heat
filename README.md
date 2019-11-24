# home-heat
A web app that manages the heating of my house

## Local Development

Install dependencies for local development using:
```
npm ci
```

## Deployment

1. Push code to Google by using:
```
npm run deploy
```

2. Publish the web-app from the script [here](https://script.google.com/d/10rdOYPj5eix6kF7VkjrmR8LDWrHty8pLn0kW5yhmMm_A5pdr8S-RUWxR/edit?usp=drive_web).

    1. Select Publish -> Deploy as web app...
    2. Set Project version to "New"
    3. Set Who has access to the app to "Anyone, even anonymous"
    4. Press "Update"

## Web App

The webapp is accessable at https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec.

### Test Time:
https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=testTime

Tests the server's time to understand how scheduling might work

### Honor Schedule
https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=honorSchedule

Check the schedule and run any necessary processes based on the current time
