import { Device } from 'dirigera';
import { CommonControllerAttributes } from 'dirigera/dist/src/types/device/Controller.js';
import { PlatformAccessory } from 'homebridge';
import { DirigeraHub } from '../dirigera-hub.js';
import { DirigeraPlatform } from '../dirigera-platform.js';
import { DirigeraDevice } from './dirigera-device.js';

export class Controller extends DirigeraDevice<CommonControllerAttributes> {

    static readonly create = async (platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device): Promise<Controller> => {
        return new Controller(platform, hub, accessory, device);
    }

    private constructor(platform: DirigeraPlatform, hub: DirigeraHub, accessory: PlatformAccessory, device: Device) {
        super(platform, hub, accessory, device, accessory.getService(platform.Service.StatelessProgrammableSwitch) ?? accessory.addService(platform.Service.StatelessProgrammableSwitch));

        // TODO: wire StatelessProgrammableSwitch ProgrammableSwitchEvent to controller button presses.
        // Not yet registered in the device registry (src/device/index.ts).
    }

    update(attributes: CommonControllerAttributes) {
        this.device.attributes = attributes;
    }

    async close(){
    }

}