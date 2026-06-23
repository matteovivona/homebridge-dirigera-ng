import { XDevice } from '../dirigera.js';
import { AirQualitySensor } from './air-quality-sensor.js';
import { Blinds } from './blinds.js';
import { ContactSensor } from './contact-sensor.js';
import { DirigeraDevice } from './dirigera-device.js';
import { LeakSensor } from './leak-sensor.js';
import { Light } from './light.js';
import { MotionSensor } from './motion-sensor.js';
import { Outlet } from './outlet.js';

export const Devices: { [type in XDevice['deviceType']]?: DirigeraDevice.Factory } = {
    light: Light,
    blinds: Blinds,
    openCloseSensor: ContactSensor,
    motionSensor: MotionSensor,
    outlet: Outlet,
    waterSensor: LeakSensor,
    environmentSensor: AirQualitySensor
}