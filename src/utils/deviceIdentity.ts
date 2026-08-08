

import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

const v_f3f72b = '__xrun_device_id_v1';
let v_19fac1 = null;

export async function v_863c7f(): Promise<string | null> {
  if (v_19fac1) return v_19fac1;
  try {
    const v_e2a6a6 = await v_e84827.getItem(v_f3f72b);
    if (v_e2a6a6) {
      v_19fac1 = v_e2a6a6;
      return v_e2a6a6;
    }
  } catch {  }
  try {
    const { collectDeviceInfo: v_f3de6d } = require('./napApiUtils');
    const v_34d5e3 = await v_f3de6d();
    const v_479f05 =
      (v_34d5e3?.adid && String(v_34d5e3.adid).replace(/^0+$/, '')) ||
      (v_34d5e3?.deviceId && String(v_34d5e3.deviceId)) ||
      '';
    const v_738e47 = v_479f05.trim();
    if (!v_738e47 || v_738e47 === 'unknown-unknown-unknown') return null;
    v_19fac1 = v_738e47;
    try { await v_e84827.setItem(v_f3f72b, v_738e47); } catch {  }
    return v_738e47;
  } catch (v_9e86fd) {
    console.warn('[deviceIdentity] failed to resolve device_id:', v_9e86fd);
    return null;
  }
}
