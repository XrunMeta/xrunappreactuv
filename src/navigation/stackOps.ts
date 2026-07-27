

export function v_68ecf9<T extends string>(v_8d490a, v_53746a): T[] {
  if (v_8d490a.length === 0) return [v_53746a];
  if (v_8d490a[v_8d490a.length - 1] === v_53746a) return v_8d490a;
  return [...v_8d490a.slice(0, -1), v_53746a];
}
