# home-heat
A web app that manages the heating of my house.

**Why**
I have 2 different heating systems in my house: Mysa for in-wall forced air heating, and Sensibo for a Heating/AC system.

Mysa has a geo-fencing feature, but I found it to be unreliable. Even if it was reliable, it wouldn't be able to change my Sensibo.

So, I wanted to make my own system for thermostat scheduling that can control both Mysa and Sensibo, and which can also be manipulated using a 3rd party Geofencing (IFTTT).

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

The web app is accessible at https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec.

### Honor Schedule
https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=honorSchedule

Check the schedule and run any necessary processes based on the current time

### Away
`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=away`

with payload
```json
{
    "passcode": "secretString",
    "away": "true"
}
```

### Vacation
`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=vacation`

with payload
```json
{
    "passcode": "secretString",
    "vacation": "true"
}
```
