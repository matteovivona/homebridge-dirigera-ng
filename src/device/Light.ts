import { DirigeraHub } from '../DirigeraHub.js';
import { PlatformAccessory } from 'homebridge';
import { Device } from 'dirigera';
import { LightAttributes } from 'dirigera/dist/src/types/device/Light.js';
import { DirigeraPlatform } from '../DirigeraPlatform.js';
import { isBoolean, isNumber } from '../common.js';
import { DirigeraDevice } from './DirigeraDevice.js';
import { Switch } from './Switch.js';

export class Light extends DirigeraDevice<LightAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<Light> => {
        const asSwitch = hub.config.devices?.[device.id]?.asSwitch ?? false;
        if (asSwitch) {
            return Switch.create(platform, hub, accessory, device);
        }
        return new Light(platform, hub, accessory, device);
    }

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.Lightbulb) ?? accessory.addService(platform.Service.Lightbulb));

        this.service.getCharacteristic(platform.Characteristic.On)
            .setValue(this.device.attributes.isOn as boolean)
            .onSet(async (value, context) => {
                const isOn = !!value;
                this.device.attributes.isOn = isOn;
                if (!context?.fromDirigera) {
                    await hub.setDeviceAttributes(device.id, { isOn } as LightAttributes);
                }
            });

        if (isNumber(device.attributes.lightLevel)) {
            this.service.getCharacteristic(platform.Characteristic.Brightness)
                .setValue(device.attributes.lightLevel)
                .onSet(async (value, context) => {
                    const lightLevel = value as number;
                    this.device.attributes.lightLevel = lightLevel
                    const { colorTemperature, colorSaturation } = this.device.attributes;
                    if (!context?.fromDirigera) {
                        await hub.setDeviceAttributes(device.id, { lightLevel, colorSaturation, colorTemperature } as LightAttributes);
                    }
                });
        }

        if (isNumber(device.attributes.colorHue)) {
            this.service.getCharacteristic(platform.Characteristic.Hue)
                .setValue(device.attributes.colorHue)
                .onSet(async (value, context) => {
                    const colorHue = value as number;
                    this.device.attributes.colorHue = colorHue;
                    const { colorSaturation } = this.device.attributes;
                    if (!context?.fromDirigera) {
                        await hub.setDeviceAttributes(device.id, { colorHue, colorSaturation } as LightAttributes);
                    }
                });
        }

        if (isNumber(device.attributes.colorSaturation)) {
            this.service.getCharacteristic(platform.Characteristic.Saturation)
                .setValue(device.attributes.colorSaturation * 100)
                .onSet(async (value, context) => {
                    const colorSaturation = <number>value / 100;
                    this.device.attributes.colorSaturation = colorSaturation;
                    const { colorHue } = this.device.attributes;
                    if (!context?.fromDirigera) {
                        await hub.setDeviceAttributes(device.id, { colorHue, colorSaturation } as LightAttributes);
                    }
                });
        }

        if (isNumber(device.attributes.colorTemperature)) {

            let colorTemperature = device.attributes.colorTemperature;

            let min;
            let max;

            if (isNumber(device.attributes.colorTemperatureMin) && isNumber(device.attributes.colorTemperatureMax)) {
                min = Math.max(device.attributes.colorTemperatureMin, device.attributes.colorTemperatureMax);
                max = Math.min(device.attributes.colorTemperatureMin, device.attributes.colorTemperatureMax);
                colorTemperature = Math.max(min, colorTemperature);
                colorTemperature = Math.min(max, colorTemperature);
            }

            const value = 1_000_000 / colorTemperature;

            this.service.getCharacteristic(platform.Characteristic.ColorTemperature)
                .setValue(value)
                .setProps({
                    minValue: isNumber(min) ?  1_000_000 / min : undefined,
                    maxValue: isNumber(max) ? 1_000_000 / max : undefined
                })
                .onSet(async (value, context) => {
                    let colorTemperature = Math.round(1_000_000 / <number>value);
                    if (isNumber(device.attributes.colorTemperatureMin)) {
                        colorTemperature = Math.min(device.attributes.colorTemperatureMin, colorTemperature);
                    }
                    if (isNumber(device.attributes.colorTemperatureMax)) {
                        colorTemperature = Math.max(device.attributes.colorTemperatureMax, colorTemperature);
                    }
                    device.attributes.colorTemperature = colorTemperature;
                    if (!context?.fromDirigera) {
                        await hub.setDeviceAttributes(device.id, { colorTemperature } as LightAttributes)
                    }
                });
        }

    }

    update(attributes: LightAttributes) {
        this.device.attributes = {
            ...this.device.attributes,
            ...attributes
        };
        if (isBoolean(attributes.isOn)) {
            this.accessory.getService(this.platform.Service.Lightbulb)!
                .getCharacteristic(this.platform.Characteristic.On)
                .updateValue(attributes.isOn, { fromDirigera: true });
        }
        if (isNumber(attributes.lightLevel)) {
            this.service.getCharacteristic(this.platform.Characteristic.Brightness)
                .updateValue(attributes.lightLevel, { fromDirigera: true });
        }
        if (isNumber(attributes.colorHue)) {
            this.service.getCharacteristic(this.platform.Characteristic.Hue)
                .updateValue(attributes.colorHue, { fromDirigera: true });
        }
        if (isNumber(attributes.colorSaturation)) {
            this.service.getCharacteristic(this.platform.Characteristic.Saturation)
                .updateValue(attributes.colorSaturation * 100, { fromDirigera: true });
        }
        if (isNumber(attributes.colorTemperature)) {
            this.service.getCharacteristic(this.platform.Characteristic.ColorTemperature)
                .setValue(1_000_000 / attributes.colorTemperature, { fromDirigera: true });
        }
    }

    async close(){
    }

}
