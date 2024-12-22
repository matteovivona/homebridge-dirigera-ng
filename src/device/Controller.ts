import { Device } from 'dirigera';
import { CommonControllerAttributes } from 'dirigera/dist/src/types/device/Controller.js';
import { PlatformAccessory } from 'homebridge';
import { isBoolean } from '../common.js';
import { DirigeraHub } from '../DirigeraHub.js';
import { DirigeraPlatform } from '../DirigeraPlatform.js';
import { DirigeraDevice } from './DirigeraDevice.js';

export class Controller extends DirigeraDevice<CommonControllerAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<Controller> => {
        return new Controller(platform, hub, accessory, device);
    }

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.StatelessProgrammableSwitch) ?? accessory.addService(platform.Service.StatelessProgrammableSwitch));

        // this.service.addCharacteristic(platform.Characteristic.ProgrammableSwitchEvent);

    }

    update(attributes: CommonControllerAttributes) {
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