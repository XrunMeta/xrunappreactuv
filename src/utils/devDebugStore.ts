

const MAX_API = 80;
const MAX_LOGS = 150;

export interface ApiLogEntry {
  id: string;
  url: string;
  method: string;
  durationMs: number;
  status?: number;
  at: number;
}

export interface BootStepEntry {
  name: string;
  durationMs: number;
  at: number;
}

export interface LogEntry {
  id: string;
  level: 'log' | 'warn' | 'error';
  args: string;
  at: number;
}

type Listener = () => void;

class DevDebugStore {
  apiCalls: ApiLogEntry[] = [];
  bootSteps: BootStepEntry[] = [];
  logs: LogEntry[] = [];
  private bootStartTime = 0;
  private lastBootStepTime = 0;
  private listeners: Set<Listener> = new Set();
  private idSeq = 0;
  private notifyScheduled = false;

  private notify() {
    if (this.notifyScheduled) return;
    this.notifyScheduled = true;
    setTimeout(() => {
      this.notifyScheduled = false;
      this.listeners.forEach((cb) => cb());
    }, 0);
  }

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  addApi(url: string, method: string, durationMs: number, status?: number) {
    this.apiCalls.unshift({
      id: `api-${++this.idSeq}`,
      url,
      method: method.toUpperCase(),
      durationMs,
      status,
      at: Date.now(),
    });
    if (this.apiCalls.length > MAX_API) this.apiCalls.pop();
    this.notify();
  }

  recordBootStep(name: string) {
    const now = Date.now();
    if (this.bootStartTime === 0) {
      this.bootStartTime = now;
      this.lastBootStepTime = now;
    }
    const durationMs = now - this.lastBootStepTime;
    this.bootSteps.push({ name, durationMs, at: now });
    this.lastBootStepTime = now;
    this.notify();
  }

  recordBootTotal() {
    if (this.bootStartTime > 0) {
      const total = Date.now() - this.bootStartTime;
      this.bootSteps.push({ name: '▶ 총 부팅', durationMs: total, at: Date.now() });
      this.notify();
    }
  }

  addLog(level: 'log' | 'warn' | 'error', args: unknown[]) {
    const argsStr = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    this.logs.unshift({
      id: `log-${++this.idSeq}`,
      level,
      args: argsStr.slice(0, 500),
      at: Date.now(),
    });
    if (this.logs.length > MAX_LOGS) this.logs.pop();
    this.notify();
  }

  clear() {
    this.apiCalls = [];
    this.bootSteps = [];
    this.logs = [];
    this.bootStartTime = 0;
    this.lastBootStepTime = 0;
    this.notify();
  }

  getState() {
    return {
      apiCalls: [...this.apiCalls],
      bootSteps: [...this.bootSteps],
      logs: [...this.logs],
    };
  }

  init() {
    if (typeof __DEV__ === 'undefined' || !__DEV__) return;

    const self = this;
    const origFetch = global.fetch;
    if (origFetch) {
      (global as any).fetch = function (input: RequestInfo | URL, init?: RequestInit) {
        const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
        const method = (init?.method || 'GET').toUpperCase();
        const start = Date.now();
        return origFetch.call(global, input as any, init).then(
          (res) => {
            self.addApi(url, method, Date.now() - start, res.status);
            return res;
          },
          (err) => {
            self.addApi(url, method, Date.now() - start);
            throw err;
          }
        );
      };
    }

    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    console.log = (...args: unknown[]) => {
      self.addLog('log', args);
      origLog.apply(console, args);
    };
    console.warn = (...args: unknown[]) => {
      self.addLog('warn', args);
      origWarn.apply(console, args);
    };
    console.error = (...args: unknown[]) => {
      self.addLog('error', args);
      origError.apply(console, args);
    };
  }
}

export const devDebugStore = new DevDebugStore();
