<p align="center">

</p>

<span align="center">

# Homebridge Plugin for IKEA DIRIGERA Hub

### !! Experimental !!

[![Build](https://github.com/uboness/homebridge-dirigera/actions/workflows/build.yml/badge.svg?branch=latest)](https://github.com/uboness/homebridge-dirigera/actions/workflows/build.yml)

</span>

Currently supports the following device types:

- `light`
- `blinds`
- `leak sensor`
- `motion sensor`
- `outlet`
- `contact sensor`

### Settings

Multiple hubs can be configured, where each hub entry has the following settings:

- `host` (required) - specifies the host/IP of the DIRIGERA hub on your local network
- `token` (optional, yet highly recommended) - specifies the authentication token to the hub. If not 
   specified, the startup will be halted until you press on the pairing button of the hub. Then the 
   authentication token will be resolved and printed in the logs - it is reommended to copy this token and store it in 
   the settings, to avoid the creation of multiple tokens. Also, this way Homebridge won't halt during restart. 
- `name` (optional) - will be set as the name of the hub (in the logs). When not set, the name is resolved from
  the hub itself.

A typical record in the Homebridge `config` should look like this:

```json
{
  "hubs": [
    {
      "host": "<ip>",
      "token": "<auth_token>",
      "name": "Living Room"
    }
  ],
  "platform": "Dirigera"
}
```

!!! DANGER - USE AT OWN RISK !!!!

Sometimes you may find the need to pair non-ikea accessories with Dirigera. In these scenarios, since these are 
non-native accessories, Dirigera might recognize them as different accessory/service types. For example, a switch may be
recognized as lights. If this happens, you can "force" the plugin to expose certain services as other services. For that, 
you'd need to follow the following steps:

1. Configure dirigera as normal and let homebridge pick up the devices as always.
2. Choose the device you'd like to change by looking its ID in the logs. You want to look for a line that looks like this:
```
[Dirigera] [Roof] registering [light][c3a531cf-bc23-4786-b465-72bf9415a588_2] device [My Switch]
```

!!! Read carefully the following step - DO NOT PREMATURELY RESTART HB if you wish to avoid ssh'ing into your device to fix it !!! 

3. now, add the following "devices" field to the hub configuration (DO NOT RESTART HOMEBRIDGE YET):
```
{
    "host": "...",
    "token": "...",
    "name": "...",
    "devices": {
        "c3a531cf-bc23-4786-b465-72bf9415a588_2": {
            "asSwitch": true
        }
    }
}
```
4. Now that you have this configuration (AND YOU DID NOT RESTART YET), copy the whole hub configuration, save it somewhere and remove this hub definition form the configuration.
5. Now you can restart - this will completely remove all accessories that were previously created for this hub.
6. After restart, edit the `config.json` again and add back the hub definition you modified earlier.
7. Restart homebridge. Your device should not be published as a switch

Why all this hassle? Once HB registered your device as one service type, it is cached, and it cannot change it anymore. The device
first needs to be unregistered before it's registered again as a different service. Since I'm too lazy right now to code the appropriate
logic to do this un-registration automatically. I offer you a brut force approach which works for me (until it doesn't).

