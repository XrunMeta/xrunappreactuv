

const v_21354d = 80;
const v_4b0a55 = 150;

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

class v_4d87dc {
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
      this.listeners.forEach((v_16dbdb) => v_16dbdb());
    }, 0);
  }

  subscribe(v_16dbdb): () => void {
    this.listeners.add(v_16dbdb);
    return () => this.listeners.delete(v_16dbdb);
  }

  addApi(v_f71b56, v_bfe9b9, v_b98005, v_d308b5) {
    this.apiCalls.unshift({
      id: `api-${++this.idSeq}`,
      url: v_f71b56,
      method: v_bfe9b9.toUpperCase(),
      durationMs: v_b98005,
      status: v_d308b5,
      at: Date.now(),
    });
    if (this.apiCalls.length > v_21354d) this.apiCalls.pop();
    this.notify();
  }

  recordBootStep(v_1833e7) {
    const v_5c2f9f = Date.now();
    if (this.bootStartTime === 0) {
      this.bootStartTime = v_5c2f9f;
      this.lastBootStepTime = v_5c2f9f;
    }
    const v_b98005 = v_5c2f9f - this.lastBootStepTime;
    this.bootSteps.push({ name: v_1833e7, durationMs: v_b98005, at: v_5c2f9f });
    this.lastBootStepTime = v_5c2f9f;
    this.notify();
  }

  recordBootTotal() {
    if (this.bootStartTime > 0) {
      const v_c83285 = Date.now() - this.bootStartTime;
      this.bootSteps.push({ name: '▶ 총 부팅', durationMs: v_c83285, at: Date.now() });
      this.notify();
    }
  }

  addLog(v_fbe91e, v_4317d1) {
    const v_f9fdae = v_4317d1.map((v_779914) => (typeof v_779914 === 'object' ? JSON.stringify(v_779914) : String(v_779914))).join(' ');
    this.logs.unshift({
      id: `log-${++this.idSeq}`,
      level: v_fbe91e,
      args: v_f9fdae.slice(0, 500),
      at: Date.now(),
    });
    if (this.logs.length > v_4b0a55) this.logs.pop();
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

    const v_b1d852 = this;
    const v_d28431 = global.fetch;
    if (v_d28431) {
      (global as any).fetch = function (v_bbda62, v_00cfc6) {
        const v_f71b56 = typeof v_bbda62 === 'string' ? v_bbda62 : v_bbda62 instanceof Request ? v_bbda62.url : String(v_bbda62);
        const v_bfe9b9 = (v_00cfc6?.method || 'GET').toUpperCase();
        const v_965edf = Date.now();
        return v_d28431.call(global, v_bbda62 as any, v_00cfc6).then(
          (v_8f00b9) => {
            v_b1d852.addApi(v_f71b56, v_bfe9b9, Date.now() - v_965edf, v_8f00b9.status);
            return v_8f00b9;
          },
          (v_49263d) => {
            v_b1d852.addApi(v_f71b56, v_bfe9b9, Date.now() - v_965edf);
            throw v_49263d;
          }
        );
      };
    }

    const v_94468b = console.log;
    const v_ff7985 = console.warn;
    const v_fdec24 = console.error;
    console.log = (...v_4317d1: unknown[]) => {
      v_b1d852.addLog('log', v_4317d1);
      v_94468b.apply(console, v_4317d1);
    };
    console.warn = (...v_4317d1: unknown[]) => {
      v_b1d852.addLog('warn', v_4317d1);
      v_ff7985.apply(console, v_4317d1);
    };
    console.error = (...v_4317d1: unknown[]) => {
      v_b1d852.addLog('error', v_4317d1);
      v_fdec24.apply(console, v_4317d1);
    };
  }
}

export const v_92d279 = new v_4d87dc();
