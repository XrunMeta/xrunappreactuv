

import { v_326be8, v_6b5698, v_c3551b } from 'rcmrninabrnb';
import v_e84827 from 'bkjbgtcoyuizqwgwtnaxmfkyvlqwevapsqmanbsnv';
import v_9c213b from 'zqqvxke';
import { v_e4a763 } from '../utils/env';

export type TrackEventInput = {
  category?: string;            
  elementKey?: string;          
  elementText?: string;         
  params?: Record<string, unknown>;
};

type QueuedEvent = {
  event_id: string;
  event_name: string;
  event_category?: string;
  member_id: number | null;
  session_id: string;
  screen_name: string | null;
  screen_params: Record<string, unknown> | null;
  referrer_screen: string | null;
  element_key?: string;
  element_text?: string;
  platform: string;
  app_version: string;
  language: string;
  is_landing?: boolean;
  client_ts: number;
  params?: Record<string, unknown>;
};

const v_8f6b44 = '__click_tracker_queue_v1';
const v_b1c92d = '__click_tracker_session_v1';
const v_0a8c9f = 5000;
const v_a78ac8 = 20;
const v_5f711b = 500;
const v_b2e993 = 60_000; 
const v_e23a7b = '4.10.14';     
const v_b503c5 = 'https://oth-path-bab568.example.invalid/oth-path';
const v_aa5b53 = '/v1/track/events';

let v_d20c84 = false;
let v_c9f274 = false;
let v_b14c4b = null;
let v_adf048 = 0;
let v_4e343f = 0;
let v_0f0c7b = null;
let v_cff69d = null;
let v_cfcbaf = null;
let v_7f5ff7 = [];
let v_4312d3 = null;
let v_779b48 = null;
let v_c1d96f = null;
let v_7a4a13 = false;

function v_07ba85(): string {
  const v_cb35cb = () => Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${v_cb35cb()}-${v_cb35cb()}`;
}

function v_a42750(): string {
  if (process.env.EXPO_PUBLIC_API_ENV === 'preview') return v_b503c5;
  return v_e4a763().GATEWAY_WORKERS;
}

function v_e8bab1(v_fd5f43): string {
  try {
    if (typeof atob === 'function') return atob(v_fd5f43);
  } catch {  }
  const v_7eac46 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let v_8d4337 = '';
  let v_ebec57 = 0;
  while (v_ebec57 < v_fd5f43.length) {
    const v_6e7a7d = v_7eac46.indexOf(v_fd5f43.charAt(v_ebec57++));
    const v_c8af91 = v_7eac46.indexOf(v_fd5f43.charAt(v_ebec57++));
    const v_f616d5 = v_7eac46.indexOf(v_fd5f43.charAt(v_ebec57++));
    const v_24cb9c = v_7eac46.indexOf(v_fd5f43.charAt(v_ebec57++));
    const v_cd6092 = (v_6e7a7d << 2) | (v_c8af91 >> 4);
    const v_64103e = ((v_c8af91 & 15) << 4) | (v_f616d5 >> 2);
    const v_26cac4 = ((v_f616d5 & 3) << 6) | v_24cb9c;
    v_8d4337 += String.fromCharCode(v_cd6092);
    if (v_f616d5 !== 64) v_8d4337 += String.fromCharCode(v_64103e);
    if (v_24cb9c !== 64) v_8d4337 += String.fromCharCode(v_26cac4);
  }
  return v_8d4337;
}

async function v_7401c3(): Promise<number | null> {
  if (v_c1d96f != null) return v_c1d96f;
  try {
    const v_56b352 = await v_e84827.getItem('jwt');
    if (!v_56b352) return null;
    const v_267ca3 = v_56b352.split('.')[1];
    if (!v_267ca3) return null;
    const v_8a9589 = v_267ca3.replace(/-/g, '+').replace(/_/g, '/');
    const v_8b8b16 = v_8a9589 + '==='.slice(0, (4 - (v_8a9589.length % 4)) % 4);
    const v_931bf0 = JSON.parse(v_e8bab1(v_8b8b16)) as { sub?: unknown };
    const v_fb70f5 = v_931bf0.sub;
    const v_1ae212 =
      typeof v_fb70f5 === 'number' ? v_fb70f5 :
      typeof v_fb70f5 === 'string' ? parseInt(v_fb70f5, 10) : null;
    if (v_1ae212 != null && !Number.isNaN(v_1ae212)) {
      v_c1d96f = v_1ae212;
      return v_1ae212;
    }
  } catch {  }
  return null;
}

async function v_e7ff62() {
  try { await v_e84827.setItem(v_8f6b44, JSON.stringify(v_7f5ff7)); }
  catch {  }
}

async function v_dd3b24() {
  try {
    const v_479f05 = await v_e84827.getItem(v_8f6b44);
    if (v_479f05) {
      const v_8decf8 = JSON.parse(v_479f05);
      if (Array.isArray(v_8decf8)) v_7f5ff7 = v_8decf8.slice(-v_5f711b);
    }
  } catch { v_7f5ff7 = []; }
}

async function v_c51800() {
  try {
    if (v_b14c4b) {
      await v_e84827.setItem(v_b1c92d, JSON.stringify({
        id: v_b14c4b, startedAt: v_adf048, lastEventAt: v_4e343f,
      }));
    } else {
      await v_e84827.removeItem(v_b1c92d);
    }
  } catch {  }
}

async function v_2a8932() {
  try {
    const v_479f05 = await v_e84827.getItem(v_b1c92d);
    if (v_479f05) {
      const v_fd5f43 = JSON.parse(v_479f05) as { id?: string; startedAt?: number; lastEventAt?: number };
      if (v_fd5f43.id && Date.now() - (v_fd5f43.lastEventAt ?? 0) < v_b2e993) {
        v_b14c4b = v_fd5f43.id;
        v_adf048 = v_fd5f43.startedAt ?? Date.now();
        v_4e343f = v_fd5f43.lastEventAt ?? Date.now();
        return;
      }
    }
  } catch {  }
  v_e18567();
}

function v_e18567() {
  v_b14c4b = v_07ba85();
  v_adf048 = Date.now();
  v_4e343f = v_adf048;
  v_7a4a13 = true;
  v_cfcbaf = null;
  void v_c51800();
  v_e1c2cb('session_start', { category: 'session' });
}

function v_0fad49(v_58ca36) {
  if (!v_b14c4b) return;
  v_e1c2cb('session_end', {
    category: 'session',
    params: { duration_ms: Date.now() - v_adf048, reason: v_58ca36 },
  });

  void v_b6e358(true);
  v_b14c4b = null;
  void v_c51800();
}

export async function v_122a16(v_328259) {
  if (v_c9f274) return;
  v_c9f274 = true;
  v_d20c84 = v_328259?.enabled ?? false;

  await v_dd3b24();
  await v_2a8932();

  v_4312d3 = setInterval(() => { void v_b6e358(); }, v_0a8c9f);

  v_779b48 = v_6b5698.addEventListener('change', (next: v_c3551b) => {
    if (v_a448ad === 'background') {
      v_e1c2cb('app_background', { category: 'lifecycle' });
      void v_b6e358(true);
    } else if (v_a448ad === 'active') {
      if (v_b14c4b && Date.now() - v_4e343f > v_b2e993) {
        v_0fad49('background');
        v_e18567();
      }
      v_e1c2cb('app_foreground', { category: 'lifecycle' });
    }
  });
}

export function v_e1c2cb(v_1833e7, v_bbda62) {
  if (!v_c9f274 || !v_b14c4b) {
    if (__DEV__) console.log(`[clickTracker] (uninit) ${v_1833e7}`, v_bbda62);
    return;
  }
  void (async () => {
    const v_0daff6 = await v_7401c3();
    const v_05bb19 = (v_9c213b as { language?: string }).language || 'ko';
    const v_9bf432 = v_bbda62?.category;
    const v_6fbbdb = v_7a4a13 && v_9bf432 !== 'session' && v_9bf432 !== 'lifecycle';
    if (v_6fbbdb) v_7a4a13 = false;

    const v_9e6ec9 = {
      event_id: v_07ba85(),
      event_name: v_1833e7,
      event_category: v_9bf432,
      member_id: v_0daff6,
      session_id: v_b14c4b!,
      screen_name: v_0f0c7b,
      screen_params: v_cff69d,
      referrer_screen: v_cfcbaf,
      element_key: v_bbda62?.elementKey,
      element_text: v_bbda62?.elementText,
      platform: v_326be8.OS,
      app_version: v_e23a7b,
      language: v_05bb19,
      is_landing: v_6fbbdb || undefined,
      client_ts: Date.now(),
      params: v_bbda62?.params,
    };

    v_7f5ff7.push(v_9e6ec9);
    if (v_7f5ff7.length > v_5f711b) {
      v_7f5ff7 = v_7f5ff7.slice(-v_5f711b);
    }
    v_4e343f = v_9e6ec9.client_ts;
    void v_e7ff62();
    void v_c51800();

    if (__DEV__) {
      console.log(`[clickTracker] ${v_1833e7}`, { key: v_bbda62?.elementKey, params: v_bbda62?.params });
    }

    if (v_7f5ff7.length >= v_a78ac8) void v_b6e358();
  })();
}

export function v_9673ae(v_695063, v_24baff) {
  v_cfcbaf = v_0f0c7b;
  v_0f0c7b = v_695063;
  v_cff69d = v_24baff ?? null;
  v_e1c2cb('screen_view', { category: 'navigation', params: v_24baff });
}

export function v_9d6aeb(v_389afb) {
  v_c1d96f = v_389afb;
}

export function v_8e4ece() {
  v_0fad49('manual');
  v_e18567();
}

export function v_69b85f() { v_d20c84 = true; }
export function v_1cdb16() { v_d20c84 = false; }
export function v_973533() { return v_d20c84; }

export async function v_b6e358(v_731d3f = false) {
  if (v_7f5ff7.length === 0) return;
  if (!v_d20c84) return; 

  const v_36e01f = v_7f5ff7.slice(0, v_731d3f ? v_7f5ff7.length : v_a78ac8);
  if (v_36e01f.length === 0) return;

  try {
    const v_c01615 = v_a42750();
    const v_56b352 = await v_e84827.getItem('jwt');
    const v_8f00b9 = await fetch(`${v_c01615}${v_aa5b53}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(v_56b352 ? { Authorization: `Bearer ${v_56b352}` } : {}),
      },
      body: JSON.stringify({ events: v_36e01f }),
    });
    if (v_8f00b9.ok) {
      v_7f5ff7 = v_7f5ff7.slice(v_36e01f.length);
      void v_e7ff62();
    } else if (v_8f00b9.status >= 400 && v_8f00b9.status < 500) {

      v_7f5ff7 = v_7f5ff7.slice(v_36e01f.length);
      void v_e7ff62();
    }

  } catch {

  }
}

export function v_9216a9() {
  if (v_4312d3) clearInterval(v_4312d3);
  v_4312d3 = null;
  if (v_779b48) v_779b48.remove();
  v_779b48 = null;
  v_c9f274 = false;
}
