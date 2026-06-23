import { Device } from 'dirigera';
import { OpenCloseSensor, OpenCloseSensorAttributes } from 'dirigera/dist/src/types/device/OpenCloseSensor.js';
import { PlatformAccessory, Service } from 'homebridge';
import { isBoolean, isNumber } from '../common.js';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';

export class ContactSensor extends DirigeraDevice<OpenCloseSensorAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<ContactSensor> => {
        return new ContactSensor(platform, hub, accessory, <OpenCloseSensor>device);
    }

    private battery?: Service;

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: OpenCloseSensor) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.ContactSensor) ?? accessory.addService(platform.Service.ContactSensor));

        this.service.getCharacteristic(platform.Characteristic.ContactSensorState)
            .updateValue(!!this.device.attributes.isOpen)

        if (isNumber(device.attributes.batteryPercentage)) {
            this.battery = accessory.getService(platform.Service.Battery) ?? accessory.addService(platform.Service.Battery);
            this.battery.getCharacteristic(platform.Characteristic.BatteryLevel)
                .updateValue(device.attributes.batteryPercentage)
        }
    }

    update(attributes: OpenCloseSensorAttributes) {
        this.device.attributes = {
            ...this.device.attributes,
            ...attributes
        };
        if (isBoolean(attributes.isOpen)) {
            this.accessory.getService(this.platform.Service.ContactSensor)!
                .getCharacteristic(this.platform.Characteristic.ContactSensorState)
                .updateValue(attributes.isOpen);
        }
        if (isNumber(attributes.batteryPercentage) && this.battery) {
            this.device.attributes.batteryPercentage = attributes.batteryPercentage;
            this.battery.getCharacteristic(this.platform.Characteristic.BatteryLevel)
                .updateValue(attributes.batteryPercentage)
        }
    }

    async close(){
    }

}
