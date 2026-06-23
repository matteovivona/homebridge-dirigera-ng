import { Device } from 'dirigera';
import { LightAttributes } from 'dirigera/dist/src/types/device/Light.js';
import { Outlet as _Outlet, OutletAttributes } from 'dirigera/dist/src/types/device/Outlet.js';
import { PlatformAccessory } from 'homebridge';
import { isBoolean } from '../common.js';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';
import { Switch } from './switch.js';

export class Outlet extends DirigeraDevice<OutletAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<Outlet> => {
        const asSwitch = hub.config.devices?.[device.id]?.asSwitch ?? false;
        if (asSwitch) {
            return Switch.create(platform, hub, accessory, device);
        }
        return new Outlet(platform, hub, accessory, <_Outlet>device);
    };

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: _Outlet) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.Outlet) ?? accessory.addService(platform.Service.Outlet));

        this.service.getCharacteristic(platform.Characteristic.On)
            .updateValue(this.device.attributes.isOn as boolean)
            .onSet(async (value) => {
                const isOn = !!value;
                this.device.attributes.isOn = isOn;
                await hub.setDeviceAttributes(device.id, { isOn } as LightAttributes);
            });

    }

    update(attributes: OutletAttributes) {
        this.device.attributes = attributes;
        if (isBoolean(attributes.isOn)) {
            this.accessory.getService(this.platform.Service.Outlet)!
                .getCharacteristic(this.platform.Characteristic.On)
                .updateValue(attributes.isOn);
        }
    }

    async close() {
    }

}
