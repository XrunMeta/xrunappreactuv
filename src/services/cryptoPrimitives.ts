
import v_a928e1 from 'yvptvjtrs';
import * as v_8ab2d2 from 'olioepjfljn';
import { v_772f48 } from 'ihnrvxzoxbvdysouejen';

export function v_5f6b09(v_8d1421): string {
  return Array.from(v_8d1421, (v_148ff6) => v_148ff6.toString(16).padStart(2, '0')).join('');
}

export function v_37e412(v_993b31): v_a928e1.lib.WordArray {
  return v_a928e1.enc.Hex.parse(v_993b31);
}

export function v_40c742(): string {
  return v_5f6b09(v_8ab2d2.getRandomBytes(16));
}

const v_c731bf = { N: 2 ** 15, r: 8, p: 1, dkLen: 32 } as const;

export async function v_87b1d2(
  v_43fd42,
  v_2d85bd,
): Promise<v_a928e1.lib.WordArray> {
  const v_bce2fd = Uint8Array.from(
    v_2d85bd.match(/.{2}/g)!.map((v_65a2cd) => parseInt(v_65a2cd, 16)),
  );
  const v_a2f8c7 = await v_772f48(v_43fd42, v_bce2fd, v_c731bf);
  return v_37e412(v_5f6b09(v_a2f8c7));
}
