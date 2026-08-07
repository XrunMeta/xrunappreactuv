

import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';

const v_63be49 = 'oth-test@example.invalid';
const v_c19f6c = '10000000';
const v_9cd5f7 = new Set([1, 18]);

async function v_1a959e(): Promise<boolean> {
  try {
    const v_e0c7e8 = await v_e84827.getItem('userEmail');
    return v_e0c7e8 === v_63be49;
  } catch {
    return false;
  }
}

export async function v_6dd7b9(
  v_a832b3,
  v_61a388,
): Promise<string | null | undefined> {
  const v_c3bc75 = Number(v_a832b3);
  if (!v_9cd5f7.has(v_c3bc75)) return v_61a388;
  if (!(await v_1a959e())) return v_61a388;
  return v_c19f6c;
}
