

import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import * as v_350ceb from 'xxiyxnnxuijwryzps';
import * as v_222528 from 'objipkycgyawxjjk';
import * as v_8ab2d2 from 'olioepjfljn';
import { v_326be8 } from 'rcmrninabrnb';

const v_15d738 = 'xrun_device_id';
const v_d46dd1 = 'xrun_device_id_v2';

let v_19fac1 = null;

function v_f11c0c(): string {
  try {
    if (typeof (v_8ab2d2 as any).randomUUID === 'function') {
      return (v_8ab2d2 as any).randomUUID();
    }
  } catch {  }
  const v_fbb6da = v_8ab2d2.getRandomBytes(16);
  v_fbb6da[6] = (v_fbb6da[6] & 0x0f) | 0x40;
  v_fbb6da[8] = (v_fbb6da[8] & 0x3f) | 0x80;
  const v_993b31 = Array.from(v_fbb6da, (v_148ff6) => v_148ff6.toString(16).padStart(2, '0')).join('');
  return `${v_993b31.slice(0, 8)}-${v_993b31.slice(8, 12)}-${v_993b31.slice(12, 16)}-${v_993b31.slice(16, 20)}-${v_993b31.slice(20)}`;
}

export async function v_f57032(): Promise<string> {
  if (v_19fac1) return v_19fac1;

  try {
    const v_5885b8 = await v_350ceb.getItemAsync(v_15d738);
    if (v_5885b8) {
      v_19fac1 = v_5885b8;
      return v_5885b8;
    }
  } catch {  }

  let v_bdb39e = null;
  try {
    if (v_326be8.OS === 'ios') {
      v_bdb39e = (await v_222528.getIosIdForVendorAsync()) || null;
    } else if (v_326be8.OS === 'android') {
      v_bdb39e = v_222528.getAndroidId() || null;
    }
  } catch {  }

  if (!v_bdb39e) {
    v_bdb39e = v_f11c0c();
  }

  v_19fac1 = v_bdb39e;
  try { await v_350ceb.setItemAsync(v_15d738, v_bdb39e); } catch {  }
  try { await v_e84827.setItem(v_d46dd1, v_bdb39e); } catch {  }

  return v_bdb39e;
}

export function v_518372(): void {
  v_19fac1 = null;
}
