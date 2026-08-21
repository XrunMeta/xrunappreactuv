

import { v_326be8 } from 'rcmrninabrnb';
import * as v_222528 from 'objipkycgyawxjjk';
import { v_f57032 } from './deviceIdentity';

export type DeviceSignals = {
  device_key: string; 
  install_uuid: string; 
  device_id: string; 
  platform: 'ios' | 'android';
  app_build: number; 
};

export async function v_716927(): Promise<DeviceSignals> {
  const v_7d58c7 = await v_f57032();
  const v_81a27a = v_326be8.OS === 'android' ? 'android' : 'ios';

  let v_9e0bfb = v_7d58c7;
  if (v_81a27a === 'android') {
    try {
      const v_5cfaf4 = v_222528.getAndroidId();
      if (v_5cfaf4) v_9e0bfb = v_5cfaf4;
    } catch {  }
  }

  let v_f9e4af = 0;
  try {

    const { getCurrentAppVersionNumber: v_650134 } = require('../services/versionCheck');
    v_f9e4af = v_650134() || 0;
  } catch {  }

  return {
    device_key: v_9e0bfb,
    install_uuid: v_7d58c7,
    device_id: v_7d58c7,
    platform: v_81a27a,
    app_build: v_f9e4af,
  };
}
