import { Device } from 'dirigera';
import { LightAttributes } from 'dirigera/dist/src/types/device/Light.js';
import { PlatformAccessory } from 'homebridge';
import { isBoolean } from '../common.js';
import { SwitchAttributes } from '../dirigera.js';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';
import { Light } from './light.js';

export class Switch extends DirigeraDevice<LightAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<Light> => {
        return new Switch(platform, hub, accessory, device);
    }

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.Switch) ?? accessory.addService(platform.Service.Switch));

        this.service.getCharacteristic(platform.Characteristic.On)
            .setValue(this.device.attributes.isOn as boolean)
            .onSet(async (value, context) => {
                const isOn = !!value;
                this.device.attributes.isOn = isOn;
                if (!context?.fromDirigera) {
                    await hub.setDeviceAttributes(device.id, { isOn } as LightAttributes);
                }
            });

    }

    update(attributes: SwitchAttributes) {
        this.device.attributes = attributes;
        if (isBoolean(attributes.isOn)) {
            this.accessory.getService(this.platform.Service.Switch)!
                .getCharacteristic(this.platform.Characteristic.On)
                .setValue(attributes.isOn, { fromDirigera: true });
        }
    }

    async close(){
    }

}