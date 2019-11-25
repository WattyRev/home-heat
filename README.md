# home-heat
A web app that manages the heating of my house.

## Why

I have 2 different heating systems in my house: Mysa for in-wall forced air heating, and Sensibo for a Heating/AC system.

Mysa has a geo-fencing feature, but I found it to be unreliable. Even if it was reliable, it wouldn't be able to change my Sensibo.

So, I wanted to make my own system for thermostat scheduling that can control both Mysa and Sensibo, and which can also be manipulated using a 3rd party Geofencing (IFTTT).

## How

Architecture:
```
       +-----+
       |Timer|
       +--+--+
          |
          | Run Schedule     +------------+                              +---------------+
          +----------------->+            |     Persistent Storage       |               |
                             | App Script +<---------------------------->+ Google Sheets |
    +------------------------+            |     Get daily schedules      |               |
    |    Set Thermostats     +-----^------+     Manage event logs        +---------------+
    |                              |            Manage Away States
    |                              |
    |      Notify Away status      |
+---v---+  from geofence, voice    |
|       |  command, or other method|
| IFTTT +--------------------------+
|       |
+---^---+
    |                     +------------------+
    |                     |                  |
    +---------------------+ Google Assistant |
      Manually Trigger    |                  |
      processes via Voice +------------------+

```

### App Script
https://script.google.com/d/10rdOYPj5eix6kF7VkjrmR8LDWrHty8pLn0kW5yhmMm_A5pdr8S-RUWxR/edit?usp=drive_web (No you can't have access. This link is for my benefit not yours.)

The code in this repository drives the App Script.

This maintains the logic for how to manage schedules, away/vacation status. It provides endpoints that can be hit from IFTTT to notify status changes, and it can make requests to IFTTT to manipulate thermostats.

The App Script creates these endpoints:

#### Honor Schedule
Check the schedule and run any necessary processes based on the current time

`GET https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=honorSchedule`


#### Spencer Away
Update Spencer's Away status.

`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=spencerAway`

with payload
```json
{
    "passcode": "secretString",
    "away": "true"
}
```

#### Michael Away
Update Michael's Away status.

`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=michaelAway`

with payload
```json
{
    "passcode": "secretString",
    "away": "true"
}
```

#### Redrive Schedule
Make all thermostats resume their schedules.

`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=redriveSchedule`

with payload
```json
{
    "passcode": "secretString"
}
```

### Google Sheets
https://docs.google.com/spreadsheets/d/1k0IFQt2_8IGewYpHcTP1sgD8xhVJWD73OFyQyhJLoNQ/edit#gid=0 (No you can't have access. This link is for my benefit not yours.)

Since the App Script is just static code that gets run on a timer, it needs some way to store state (away/vacation).

Google Sheets can provide that persistent storage for state and for logging. It also provides a relatively easy and robust way of managing schedules for each thermostat, so that scheduling configuration is stored here.

### IFTTT
http://ifttt.com

IFTTT is used as the intermediary between 3rd party services (Mysa, Sensibo, and Google Assistant) and my script. Here I have applets set up to set the temperature of each thermostat, and to relay messages from the Google Assistant to my service. IFTTT also provides geofencing features which can drive additional functionality when I enter or leave my home.
