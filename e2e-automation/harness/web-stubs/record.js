

function v_dc53ea() {
  const v_206b88 = globalThis;
  if (!v_206b88.__E2E_SDK_CALLS__) v_206b88.__E2E_SDK_CALLS__ = [];
  return v_206b88.__E2E_SDK_CALLS__;
}

function v_cbbd71(v_05a921, v_4317d1, v_43c42e) {
  v_dc53ea().push({ api: v_05a921, args: v_96ba87(v_4317d1) });

  console.log('[E2E-STUB]', v_05a921);
  return v_43c42e;
}

function v_96ba87(v_4317d1) {
  try {
    return JSON.parse(JSON.stringify(v_4317d1));
  } catch (v_9e86fd) {
    return ['<직렬화 불가>'];
  }
}

module.exports = { record: v_cbbd71, bucket: v_dc53ea };
