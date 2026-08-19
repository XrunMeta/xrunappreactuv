

export type ProbeEntry = { key: string; value: string };

export type ProbeSnapshot = {
  screen: string;
  sessionId: string;
  startedAt: number;
  entries: ProbeEntry[];
};

type ScreenState = {
  sessionId: string;
  startedAt: number;
  values: Map<string, string>;
  subscribers: Set<(snap: ProbeSnapshot) => void>;
};

const v_095859 = new Map<string, ScreenState>();

let v_32c704 = 0;

function v_28b0fa(): string {
  v_32c704 += 1;

  return `${Date.now().toString(36)}-${v_32c704.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function v_d99d28(v_53746a): ScreenState {
  let v_fd5f43 = v_095859.get(v_53746a);
  if (!v_fd5f43) {
    v_fd5f43 = {
      sessionId: v_28b0fa(),
      startedAt: Date.now(),
      values: new Map(),
      subscribers: new Set(),
    };
    v_095859.set(v_53746a, v_fd5f43);
  }
  return v_fd5f43;
}

function v_a5cea4(v_53746a, v_fd5f43): ProbeSnapshot {
  return {
    screen: v_53746a,
    sessionId: v_fd5f43.sessionId,
    startedAt: v_fd5f43.startedAt,
    entries: Array.from(v_fd5f43.values, ([v_b24339, v_3b402b]) => ({ key: v_b24339, value: v_3b402b })),
  };
}

function v_c226a5(v_53746a, v_fd5f43): void {
  const v_a13bfb = v_a5cea4(v_53746a, v_fd5f43);
  v_fd5f43.subscribers.forEach((v_16dbdb) => {
    try {
      v_16dbdb(v_a13bfb);
    } catch {

    }
  });
}

export function v_5b16e5(v_53746a): string {
  const v_fd5f43 = v_d99d28(v_53746a);
  v_fd5f43.values.clear();
  v_fd5f43.sessionId = v_28b0fa();
  v_fd5f43.startedAt = Date.now();
  return v_fd5f43.sessionId;
}

export function v_c980a8(v_53746a, v_b24339, v_3b402b): void {
  const v_fd5f43 = v_d99d28(v_53746a);
  if (v_fd5f43.values.get(v_b24339) === v_3b402b) return; 
  v_fd5f43.values.set(v_b24339, v_3b402b);
  v_c226a5(v_53746a, v_fd5f43);
}

export function v_eae756(v_53746a, v_b24339): void {
  const v_fd5f43 = v_d99d28(v_53746a);
  if (!v_fd5f43.values.has(v_b24339)) return;
  v_fd5f43.values.delete(v_b24339);
  v_c226a5(v_53746a, v_fd5f43);
}

export function v_3e9afb(v_53746a): ProbeSnapshot | null {
  const v_fd5f43 = v_095859.get(v_53746a);
  return v_fd5f43 ? v_a5cea4(v_53746a, v_fd5f43) : null;
}

export function v_8bb844(
  v_53746a,
  v_16dbdb,
): () => void {
  const v_fd5f43 = v_d99d28(v_53746a);
  v_fd5f43.subscribers.add(v_16dbdb);
  return () => {
    v_fd5f43.subscribers.delete(v_16dbdb);
  };
}
