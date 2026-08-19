

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

const screens = new Map<string, ScreenState>();

let sessionCounter = 0;

function newSessionId(): string {
  sessionCounter += 1;

  return `${Date.now().toString(36)}-${sessionCounter.toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function ensure(screen: string): ScreenState {
  let s = screens.get(screen);
  if (!s) {
    s = {
      sessionId: newSessionId(),
      startedAt: Date.now(),
      values: new Map(),
      subscribers: new Set(),
    };
    screens.set(screen, s);
  }
  return s;
}

function snapshotOf(screen: string, s: ScreenState): ProbeSnapshot {
  return {
    screen,
    sessionId: s.sessionId,
    startedAt: s.startedAt,
    entries: Array.from(s.values, ([key, value]) => ({ key, value })),
  };
}

function notify(screen: string, s: ScreenState): void {
  const snap = snapshotOf(screen, s);
  s.subscribers.forEach((cb) => {
    try {
      cb(snap);
    } catch {

    }
  });
}

export function probeReset(screen: string): string {
  const s = ensure(screen);
  s.values.clear();
  s.sessionId = newSessionId();
  s.startedAt = Date.now();
  return s.sessionId;
}

export function probeRegister(screen: string, key: string, value: string): void {
  const s = ensure(screen);
  if (s.values.get(key) === value) return; 
  s.values.set(key, value);
  notify(screen, s);
}

export function probeUnregister(screen: string, key: string): void {
  const s = ensure(screen);
  if (!s.values.has(key)) return;
  s.values.delete(key);
  notify(screen, s);
}

export function probeSnapshot(screen: string): ProbeSnapshot | null {
  const s = screens.get(screen);
  return s ? snapshotOf(screen, s) : null;
}

export function probeSubscribe(
  screen: string,
  cb: (snap: ProbeSnapshot) => void,
): () => void {
  const s = ensure(screen);
  s.subscribers.add(cb);
  return () => {
    s.subscribers.delete(cb);
  };
}
