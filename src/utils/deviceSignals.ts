

import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { getInstallUuid } from './deviceIdentity';

export type DeviceSignals = {
  device_key: string; 
  install_uuid: string; 
  device_id: string; 
  platform: 'ios' | 'android';
  app_build: number; 
};

export async function collectDeviceSignals(): Promise<DeviceSignals> {
  const installUuid = await getInstallUuid();
  const platform: 'ios' | 'android' = Platform.OS === 'android' ? 'android' : 'ios';

  let deviceKey = installUuid;
  if (platform === 'android') {
    try {
      const ssaid = Application.getAndroidId();
      if (ssaid) deviceKey = ssaid;
    } catch {  }
  }

  let appBuild = 0;
  try {

    const { getCurrentAppVersionNumber } = require('../services/versionCheck');
    appBuild = getCurrentAppVersionNumber() || 0;
  } catch {  }

  return {
    device_key: deviceKey,
    install_uuid: installUuid,
    device_id: installUuid,
    platform,
    app_build: appBuild,
  };
}
