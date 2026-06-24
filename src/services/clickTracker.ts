

import { Platform, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { getEnv } from '../utils/env';

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

const QUEUE_STORAGE_KEY = '__click_tracker_queue_v1';
const SESSION_STORAGE_KEY = '__click_tracker_session_v1';
const FLUSH_INTERVAL_MS = 5000;
const FLUSH_BATCH_SIZE = 20;
const MAX_QUEUE_SIZE = 500;
const SESSION_TIMEOUT_MS = 60_000; 
const APP_VERSION = '4.10.14';     
const PREVIEW_URL = 'https://edge-preview.example.invalid/oth-path';
const TRACK_PATH = '/v1/track/events';

let enabled = false;
let initialized = false;
let currentSessionId: string | null = null;
let sessionStartedAt = 0;
let lastEventAt = 0;
let currentScreen: string | null = null;
let currentScreenParams: Record<string, unknown> | null = null;
let prevScreen: string | null = null;
let memoryQueue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let appStateSub: { remove: () => void } | null = null;
let cachedMemberId: number | null = null;
let pendingLanding = false;

function uuid(): string {
  const r = () => Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${r()}-${r()}`;
}

function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_ENV === 'preview') return PREVIEW_URL;
  return getEnv().GATEWAY_WORKERS;
}

function decodeBase64(s: string): string {
  try {
    if (typeof atob === 'function') return atob(s);
  } catch {  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c1 = chars.indexOf(s.charAt(i++));
    const c2 = chars.indexOf(s.charAt(i++));
    const c3 = chars.indexOf(s.charAt(i++));
    const c4 = chars.indexOf(s.charAt(i++));
    const b1 = (c1 << 2) | (c2 >> 4);
    const b2 = ((c2 & 15) << 4) | (c3 >> 2);
    const b3 = ((c3 & 3) << 6) | c4;
    out += String.fromCharCode(b1);
    if (c3 !== 64) out += String.fromCharCode(b2);
    if (c4 !== 64) out += String.fromCharCode(b3);
  }
  return out;
}

async function loadMemberIdFromJwt(): Promise<number | null> {
  if (cachedMemberId != null) return cachedMemberId;
  try {
    const jwt = await AsyncStorage.getItem('jwt');
    if (!jwt) return null;
    const seg = jwt.split('.')[1];
    if (!seg) return null;
    const b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '==='.slice(0, (4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(decodeBase64(padded)) as { sub?: unknown };
    const subRaw = payload.sub;
    const sub =
      typeof subRaw === 'number' ? subRaw :
      typeof subRaw === 'string' ? parseInt(subRaw, 10) : null;
    if (sub != null && !Number.isNaN(sub)) {
      cachedMemberId = sub;
      return sub;
    }
  } catch {  }
  return null;
}

async function persistQueue() {
  try { await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(memoryQueue)); }
  catch {  }
}

async function loadPersistedQueue() {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) memoryQueue = parsed.slice(-MAX_QUEUE_SIZE);
    }
  } catch { memoryQueue = []; }
}

async function persistSession() {
  try {
    if (currentSessionId) {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        id: currentSessionId, startedAt: sessionStartedAt, lastEventAt,
      }));
    } else {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {  }
}

async function loadOrCreateSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as { id?: string; startedAt?: number; lastEventAt?: number };
      if (s.id && Date.now() - (s.lastEventAt ?? 0) < SESSION_TIMEOUT_MS) {
        currentSessionId = s.id;
        sessionStartedAt = s.startedAt ?? Date.now();
        lastEventAt = s.lastEventAt ?? Date.now();
        return;
      }
    }
  } catch {  }
  startNewSession();
}

function startNewSession() {
  currentSessionId = uuid();
  sessionStartedAt = Date.now();
  lastEventAt = sessionStartedAt;
  pendingLanding = true;
  prevScreen = null;
  void persistSession();
  trackEvent('session_start', { category: 'session' });
}

function endSession(reason: 'background' | 'manual') {
  if (!currentSessionId) return;
  trackEvent('session_end', {
    category: 'session',
    params: { duration_ms: Date.now() - sessionStartedAt, reason },
  });

  void flush(true);
  currentSessionId = null;
  void persistSession();
}

export async function initTracker(opts?: { enabled?: boolean }) {
  if (initialized) return;
  initialized = true;
  enabled = opts?.enabled ?? false;

  await loadPersistedQueue();
  await loadOrCreateSession();

  flushTimer = setInterval(() => { void flush(); }, FLUSH_INTERVAL_MS);

  appStateSub = AppState.addEventListener('change', (next: AppStateStatus) => {
    if (next === 'background') {
      trackEvent('app_background', { category: 'lifecycle' });
      void flush(true);
    } else if (next === 'active') {
      if (currentSessionId && Date.now() - lastEventAt > SESSION_TIMEOUT_MS) {
        endSession('background');
        startNewSession();
      }
      trackEvent('app_foreground', { category: 'lifecycle' });
    }
  });
}

export function trackEvent(name: string, input?: TrackEventInput) {
  if (!initialized || !currentSessionId) {
    if (__DEV__) console.log(`[clickTracker] (uninit) ${name}`, input);
    return;
  }
  void (async () => {
    const member_id = await loadMemberIdFromJwt();
    const language = (i18n as { language?: string }).language || 'ko';
    const cat = input?.category;
    const isLanding = pendingLanding && cat !== 'session' && cat !== 'lifecycle';
    if (isLanding) pendingLanding = false;

    const evt: QueuedEvent = {
      event_id: uuid(),
      event_name: name,
      event_category: cat,
      member_id,
      session_id: currentSessionId!,
      screen_name: currentScreen,
      screen_params: currentScreenParams,
      referrer_screen: prevScreen,
      element_key: input?.elementKey,
      element_text: input?.elementText,
      platform: Platform.OS,
      app_version: APP_VERSION,
      language,
      is_landing: isLanding || undefined,
      client_ts: Date.now(),
      params: input?.params,
    };

    memoryQueue.push(evt);
    if (memoryQueue.length > MAX_QUEUE_SIZE) {
      memoryQueue = memoryQueue.slice(-MAX_QUEUE_SIZE);
    }
    lastEventAt = evt.client_ts;
    void persistQueue();
    void persistSession();

    if (__DEV__) {
      console.log(`[clickTracker] ${name}`, { key: input?.elementKey, params: input?.params });
    }

    if (memoryQueue.length >= FLUSH_BATCH_SIZE) void flush();
  })();
}

export function trackScreen(screenName: string, params?: Record<string, unknown>) {
  prevScreen = currentScreen;
  currentScreen = screenName;
  currentScreenParams = params ?? null;
  trackEvent('screen_view', { category: 'navigation', params });
}

export function setMemberId(id: number | null) {
  cachedMemberId = id;
}

export function resetSession() {
  endSession('manual');
  startNewSession();
}

export function enableTracker() { enabled = true; }
export function disableTracker() { enabled = false; }
export function isTrackerEnabled() { return enabled; }

export async function flush(force = false) {
  if (memoryQueue.length === 0) return;
  if (!enabled) return; 

  const batch = memoryQueue.slice(0, force ? memoryQueue.length : FLUSH_BATCH_SIZE);
  if (batch.length === 0) return;

  try {
    const baseUrl = getBaseUrl();
    const jwt = await AsyncStorage.getItem('jwt');
    const res = await fetch(`${baseUrl}${TRACK_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify({ events: batch }),
    });
    if (res.ok) {
      memoryQueue = memoryQueue.slice(batch.length);
      void persistQueue();
    } else if (res.status >= 400 && res.status < 500) {

      memoryQueue = memoryQueue.slice(batch.length);
      void persistQueue();
    }

  } catch {

  }
}

export function teardownTracker() {
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = null;
  if (appStateSub) appStateSub.remove();
  appStateSub = null;
  initialized = false;
}
