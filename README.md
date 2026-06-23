<p align="center">
  <img src="https://raw.githubusercontent.com/homebridge/branding/latest/logos/homebridge-wordmark-logo-vertical.png" width="150">
</p>

<span align="center">

# Homebridge DIRIGERA NG

Homebridge plugin for the **IKEA DIRIGERA** hub.

[![Build](https://github.com/matteovivona/homebridge-dirigera-ng/actions/workflows/build.yml/badge.svg?branch=latest)](https://github.com/matteovivona/homebridge-dirigera-ng/actions/workflows/build.yml)
[![npm](https://img.shields.io/npm/v/homebridge-dirigera-ng.svg)](https://www.npmjs.com/package/homebridge-dirigera-ng)
[![npm downloads](https://img.shields.io/npm/dt/homebridge-dirigera-ng.svg)](https://www.npmjs.com/package/homebridge-dirigera-ng)

</span>

> **This project is a fork of [`uboness/homebridge-dirigera`](https://github.com/uboness/homebridge-dirigera)**
> (published on npm as `@uboness/homebridge-dirigera`) by [uboness](https://github.com/uboness), which is no
> longer maintained. This `-ng` ("next generation") fork continues maintenance with bug fixes and modernization.
> All credit for the original work goes to the upstream author — see [Credits](#credits).

## Supported device types

- `light` (on/off, brightness, hue, saturation, color temperature)
- `blinds`
- `outlet`
- `motion sensor`
- `contact sensor` (open/close)
- `leak sensor` (water)
- `air quality sensor` (environment)

## Installation

Install through the Homebridge UI (search for **Homebridge DIRIGERA NG**), or via the CLI:

```bash
npm install -g homebridge-dirigera-ng
```

## Configuration

Multiple hubs can be configured. Each hub entry supports the following settings:

| Setting  | Required | Description |
|----------|----------|-------------|
| `host`   | yes      | Host / IP of the DIRIGERA hub on your local network. |
| `token`  | no\*     | Authentication token to the hub. **Highly recommended** — see note below. |
| `name`   | no       | Display name for the hub (used in logs). Defaults to the name reported by the hub. |

\* If `token` is omitted, startup pauses for up to ~1 minute waiting for you to press
the **action button** on the bottom of the hub. The resolved token is then printed in
the logs — copy it into your config to avoid re-pairing on every restart (and to stop
Homebridge from halting during restarts).

A typical config entry:

```json
{
  "platform": "Dirigera",
  "hubs": [
    {
      "host": "192.168.1.50",
      "token": "<auth_token>",
      "name": "Living Room"
    }
  ]
}
```

## Advanced: forcing a service type (`asSwitch`)

> ⚠️ **Use at your own risk.**

When you pair non-IKEA accessories with DIRIGERA, the hub may classify them as a
different type than you expect (e.g. a switch reported as a `light`). You can force the
plugin to expose such a device as a plain switch.

1. Configure DIRIGERA normally and let Homebridge discover the devices.
2. Find the device ID in the logs — look for a line like:
   ```
   [Dirigera] [Living Room] registering [light][c3a531cf-bc23-4786-b465-72bf9415a588_2] device [My Switch]
   ```
3. Add a `devices` map to the hub configuration, keyed by that device ID
   (edit the raw JSON config — this option is not in the UI form):
   ```json
   {
     "host": "192.168.1.50",
     "token": "<auth_token>",
     "name": "Living Room",
     "devices": {
       "c3a531cf-bc23-4786-b465-72bf9415a588_2": {
         "asSwitch": true
       }
     }
   }
   ```
   `asSwitch` is supported for `light` and `outlet` devices.

> **Note on re-classification:** once Homebridge has cached a device as one service
> type, it cannot change it in place — the accessory must be unregistered and
> re-registered. The simplest way to apply a change to an already-cached device is to
> temporarily remove the hub from the config, restart Homebridge (which removes the
> cached accessories for that hub), then add the hub back with the `devices` override
> and restart again.

## Credits

- Original plugin: [uboness/homebridge-dirigera](https://github.com/uboness/homebridge-dirigera)
- DIRIGERA client library: [`dirigera`](https://github.com/lpgera/dirigera)

## License

[MIT](./LICENSE)
