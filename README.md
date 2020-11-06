# home-heat
A web app that manages the heating of my house.

## Why

I have 2 different heating systems in my house: Mysa for in-wall forced air heating, and Sensibo for a Heating/AC system.

Mysa has a geo-fencing feature, but I found it to be unreliable. Even if it was reliable, it wouldn't be able to change my Sensibo.

So, I wanted to make my own system for thermostat scheduling that can control both Mysa and Sensibo, and which can also be manipulated using a 3rd party Geofencing (IFTTT + Google Wifi).

## How

Architecture:
```
                       +-----+
                       |Timer|
                       +--+--+
                          |
                          | Run Schedule     +------------+                              +---------------+
  +----------------+      +----------------->+            |     Persistent Storage       |               |
  |                |                         | App Script +<---------------------------->+ Google Sheets |
  | Home Assistant +<------------------------+            |     Get daily schedules      |               |
  |                |     Set Thermostats     +-----^------+     Manage event logs        +---------------+
  +----------------+                               |            Manage Away States
                                                   |
                           Notify Away status      |
                +-------+  from Google Wifi, voice |
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

#### Get high temperature
Get the recent high temperature

`GET https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=getHighTemperature`


#### Away
Notify that a user has gone away or come home

`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=away`

with payload
```json
{
    "passcode": "secretString",
    "away": true,
    "name": "spencer"
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

#### Hold
Set a room on hold to prevent automatic changes in temperature

`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=hold`

with payload
```json
{
    "passcode": "secretString",
    "room": "office"
}
```

#### Stop Hold
Remove a room from hold to resume automatic changes in temperature

`POST https://script.google.com/macros/s/AKfycbyDyNEh4GhdCyGwZqqlT8bvdXzM1R1UjjIoH_fjWihC5AaYhSM/exec?action=stopHold`

with payload
```json
{
    "passcode": "secretString",
    "room": "office"
}
```

### Google Sheets
https://docs.google.com/spreadsheets/d/1k0IFQt2_8IGewYpHcTP1sgD8xhVJWD73OFyQyhJLoNQ/edit#gid=0 (No you can't have access. This link is for my benefit not yours.)

Since the App Script is just static code that gets run on a timer, it needs some way to store state (away/vacation).

Google Sheets can provide that persistent storage for state and for logging. It also provides a relatively easy and robust way of managing schedules for each thermostat, so that scheduling configuration is stored here.

### Home Assistant
https://wattyha.duckdns.org:1111
https://www.home-assistant.io/

Home Assistant is a system running on a Raspberry Pi. It is connected to all my smart home devices and is a more robust way of communicating with those devices than IFTTT is. I am new to Home Assistant, and will be moving more functionality away from IFTTT and toward Home Assistant.

### IFTTT
http://ifttt.com

IFTTT is used as the intermediary between 3rd party services (Mysa, Sensibo, and Google Assistant) and my script. Here I have applets set up to set the temperature of each thermostat, and to relay messages from the Google Assistant to my service. IFTTT also provides geofencing features which can drive additional functionality when I enter or leave my home.
