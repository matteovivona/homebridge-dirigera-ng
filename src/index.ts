import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { DirigeraPlatform } from './dirigera-platform.js';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, DirigeraPlatform);
};
