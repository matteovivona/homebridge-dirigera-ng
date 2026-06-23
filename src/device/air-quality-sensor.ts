import { Device } from 'dirigera';
import { EnvironmentSensorAttributes } from 'dirigera/dist/src/types/device/EnvironmentSensor.js';
import { PlatformAccessory, Service } from 'homebridge';
import { isNumber, runAsync } from '../common.js';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';

export class AirQualitySensor extends DirigeraDevice<EnvironmentSensorAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<AirQualitySensor> => {
        return new AirQualitySensor(platform, hub, accessory, device);
    }

    private temperature?: Service;
    private humidity?: Service;

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.AirQualitySensor) ?? accessory.addService(platform.Service.AirQualitySensor));

        const pm25 = this.device.attributes.currentPM25;

        this.service.getCharacteristic(platform.Characteristic.AirQuality)
            .setValue(pm25ToQuality(pm25));

        if (isNumber(pm25)) {
            this.service.getCharacteristic(platform.Characteristic.PM2_5Density)
                .setValue(pm25)
                .onSet(async (value) => {
                    const currentPM25 = value as number;
                    this.device.attributes.currentPM25 = currentPM25;
                    runAsync(() => {
                        this.service.getCharacteristic(platform.Characteristic.AirQuality)
                            .setValue(pm25ToQuality(currentPM25));
                    });
                });
        }

        if (isNumber(device.attributes.vocIndex)) {
            this.service.getCharacteristic(platform.Characteristic.VOCDensity)
                .setValue(device.attributes.vocIndex);
        }

        if (isNumber(device.attributes.currentTemperature)) {
            this.temperature = accessory.getService(platform.Service.TemperatureSensor) ?? accessory.addService(platform.Service.TemperatureSensor);
            this.temperature.getCharacteristic(platform.Characteristic.CurrentTemperature)
                .setValue(device.attributes.currentTemperature)
        }

        if (isNumber(device.attributes.currentRH)) {
            this.humidity = accessory.getService(platform.Service.HumiditySensor) ?? accessory.addService(platform.Service.HumiditySensor);
            this.humidity.getCharacteristic(platform.Characteristic.CurrentRelativeHumidity)
                .setValue(device.attributes.currentRH)
        }
    }

    update(attributes: EnvironmentSensorAttributes) {
        this.device.attributes = {
            ...this.device.attributes,
            ...attributes
        };
        if (isNumber(attributes.currentPM25)) {
            this.service.getCharacteristic(this.platform.Characteristic.AirQuality)
                .setValue(pm25ToQuality(attributes.currentPM25));
            this.service.getCharacteristic(this.platform.Characteristic.PM2_5Density)
                .setValue(attributes.currentPM25);
        }
        if (isNumber(attributes.vocIndex)) {
            this.service.getCharacteristic(this.platform.Characteristic.VOCDensity)
                .setValue(attributes.vocIndex);
        }
        if (isNumber(attributes.currentTemperature) && this.temperature) {
            this.temperature.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
                .setValue(attributes.currentTemperature);
        }
        if (isNumber(attributes.currentRH) && this.humidity) {
            this.humidity.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
                .updateValue(attributes.currentRH);
        }
    }

    async close(){
    }

}

function pm25ToQuality(pm25?: number): 0 | 1 | 2 | 3 | 4 | 5 {
    return !isNumber(pm25) ? 0 : //unknown
        pm25 < 15 ? 1 : // excellent
            pm25 < 35 ? 2 : // good
                pm25 < 50 ? 3 : // fair
                    pm25 < 85 ? 4 : // inferior
                        5; // poor
}