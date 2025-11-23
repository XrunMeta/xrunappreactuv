import { v_03e392 } from 'rcmrninabrnb';
import * as v_fba5a0 from 'hfxxehldoiokdq';

export const v_db97fb = async (
  v_3b402b,
  v_e5db92 = '지갑 주소가 복사되었습니다.',
) => {
  try {
    await v_fba5a0.setStringAsync(v_3b402b);
    v_03e392.alert('주소 복사', v_e5db92);
  } catch (v_5e9bfe) {
    v_03e392.alert('복사 실패', '주소를 복사하지 못했습니다. 다시 시도해주세요.');
  }
};


