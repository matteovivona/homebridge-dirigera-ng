import { PlatformAccessory, Service } from 'homebridge';
import { isBoolean, isNumber } from '../common.js';
import { WaterSensor, WaterSensorAttributes, XDevice } from '../dirigera.js';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';

export class LeakSensor extends DirigeraDevice<WaterSensorAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: XDevice): Promise<LeakSensor> => {
        return new LeakSensor(platform, hub, accessory, <WaterSensor>device);
    }

    private battery?: Service;

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: WaterSensor) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.LeakSensor) ?? accessory.addService(platform.Service.LeakSensor));

        this.service.getCharacteristic(platform.Characteristic.LeakDetected)
            .updateValue(!!this.device.attributes.waterLeakDetected)

        if (isNumber(device.attributes.batteryPercentage)) {
            this.battery = accessory.getService(platform.Service.Battery) ?? accessory.addService(platform.Service.Battery);
            this.battery.getCharacteristic(platform.Characteristic.BatteryLevel)
                .updateValue(device.attributes.batteryPercentage)
        }
    }

    update(attributes: WaterSensorAttributes) {
        this.device.attributes = {
            ...this.device.attributes,
            ...attributes
        }
        if (isBoolean(attributes.waterLeakDetected)) {
            this.service.getCharacteristic(this.platform.Characteristic.LeakDetected)
                .updateValue(attributes.waterLeakDetected);
        }
        if (isNumber(attributes.batteryPercentage) && this.battery) {
            this.battery.getCharacteristic(this.platform.Characteristic.BatteryLevel)
                .updateValue(attributes.batteryPercentage);
        }
    }

    async close(){
    }

}
