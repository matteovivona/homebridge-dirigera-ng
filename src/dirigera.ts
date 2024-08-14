import { Device } from 'dirigera';
import {
    CommonDeviceAttributes,
    IdentifiableDeviceAttributes,
    JoinableDeviceAttributes, type OtaUpdatableDeviceAttributes
} from 'dirigera/src/types/device/Device.js';
import { MotionSensorAttributes as LegacyMotionSensorAttributes } from 'dirigera/src/types/device/MotionSensor.js';

import type { Room } from 'dirigera/src/types/Room.js';

export type XDevice = Omit<Device, 'deviceType' | 'attributes'> & {
    deviceType: Device['deviceType'] | 'waterSensor',
    attributes: Device['attributes'] & Partial<WaterSensorAttributes> & Partial<XMotionSensorAttributes>
}

export interface WaterSensor extends XDevice {
    type: 'sensor'
    deviceType: 'waterSensor'
    attributes: WaterSensorAttributes,
    room: Room
    isHidden: boolean
}

export interface WaterSensorAttributes extends CommonDeviceAttributes, IdentifiableDeviceAttributes, JoinableDeviceAttributes {
    batteryPercentage: number,
    waterLeakDetected: boolean
}

export interface SwitchAttributes extends CommonDeviceAttributes, IdentifiableDeviceAttributes, JoinableDeviceAttributes, OtaUpdatableDeviceAttributes {
    isOn: boolean
    startupOnOff: 'startOn' | 'startPrevious'
    identifyStarted: string
    identifyPeriod: number
}

export interface XMotionSensor extends XDevice {
    type: 'sensor'
    deviceType: 'motionSensor'
    attributes: XMotionSensorAttributes
    isHidden: boolean
}

export interface XMotionSensorAttributes extends LegacyMotionSensorAttributes {
    isDetected: boolean,
    motionDetectedDelay?: number
}
