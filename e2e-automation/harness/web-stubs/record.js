

function bucket() {
  const g = globalThis;
  if (!g.__E2E_SDK_CALLS__) g.__E2E_SDK_CALLS__ = [];
  return g.__E2E_SDK_CALLS__;
}

function record(api, args, result) {
  bucket().push({ api, args: safeArgs(args) });

  console.log('[E2E-STUB]', api);
  return result;
}

function safeArgs(args) {
  try {
    return JSON.parse(JSON.stringify(args));
  } catch (e) {
    return ['<직렬화 불가>'];
  }
}

module.exports = { record, bucket };
