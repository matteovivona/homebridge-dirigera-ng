import { Device, MotionSensor as _MotionSensor } from 'dirigera';
import { PlatformAccessory, Service } from 'homebridge';
import { isBoolean, isNumber } from '../common.js';
import { XMotionSensorAttributes } from '../dirigera.js';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';

export class MotionSensor extends DirigeraDevice<XMotionSensorAttributes> {

    static create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<MotionSensor> => {
        return new MotionSensor(platform, hub, accessory, <_MotionSensor>device);
    }

    private battery?: Service;

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: _MotionSensor) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.MotionSensor) ?? accessory.addService(platform.Service.MotionSensor));

        this.service.getCharacteristic(platform.Characteristic.MotionDetected)
            .updateValue(!!this.device.attributes.isDetected);

        if (isNumber(this.device.attributes.batteryPercentage)) {
            this.battery = accessory.getService(platform.Service.Battery) ?? accessory.addService(platform.Service.Battery);
            this.battery.getCharacteristic(platform.Characteristic.BatteryLevel)
                .updateValue(this.device.attributes.batteryPercentage)
        }
    }

    update(attributes: XMotionSensorAttributes) {
        this.device.attributes = {
            ...this.device.attributes,
            ...attributes
        };
        if (isBoolean(attributes.isDetected)) {
            this.accessory.getService(this.platform.Service.MotionSensor)!
                .getCharacteristic(this.platform.Characteristic.MotionDetected)
                .updateValue(attributes.isDetected);
        }
        if (isNumber(attributes.batteryPercentage) && this.battery) {
            this.battery.getCharacteristic(this.platform.Characteristic.BatteryLevel)
                .updateValue(attributes.batteryPercentage)
        }
    }

    async close(){
    }

}
