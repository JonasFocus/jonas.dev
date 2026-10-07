'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type VisitEvent = {
  type: 'pageview' | 'click' | 'outbound' | 'scroll' | 'form';
  path: string;
  label?: string;
};
const SESSION_KEY = 'jx-visit';
// Set on this browser whenever the owner opens /admin, so Jonas's own visits stay out of the numbers.
export const OPT_OUT_KEY = 'jx-no-track';
const IDLE_MS = 30 * 60 * 1000;
const BEAT_MS = 15 * 1000;

function optedOut() {
  try {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    return (
      nav.globalPrivacyControl === true ||
      nav.doNotTrack === '1' ||
      nav.webdriver ||
      localStorage.getItem(OPT_OUT_KEY) === '1'
    );
  } catch {
    return true;
  }
}
// A visit lasts until the tab closes or sits idle for 30 minutes.
function sessionId() {
  const now = Date.now();
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null');
    const id =
      saved && now - saved.at < IDLE_MS ? saved.id : crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, at: now }));
    return id as string;
  } catch {
    return crypto.randomUUID();
  }
}
function labelOf(element: Element) {
  const text =
    element.getAttribute('data-track') ||
    element.getAttribute('aria-label') ||
    element.textContent ||
    '';
  return text.replace(/\s+/g, ' ').trim().slice(0, 80) || undefined;
}

let queue: VisitEvent[] = [];
let engagedMs = 0;
let visibleSince: number | null = null;
let firstBeat = true;
// React may run an effect twice for one navigation; count each page view once.
let lastView = { path: '', at: 0 };

function flush() {
  if (visibleSince !== null) {
    engagedMs += Date.now() - visibleSince;
    visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
  }
  const engaged = Math.min(3600, Math.round(engagedMs / 1000));
  if (!queue.length && engaged === 0) return;
  engagedMs -= engaged * 1000;
  const events = queue.slice(0, 30);
  queue = queue.slice(30);
  const params = new URLSearchParams(location.search);
  const body = JSON.stringify({
    session: sessionId(),
    path: location.pathname,
    ...(firstBeat && document.referrer ? { referrer: document.referrer } : {}),
    ...(params.get('utm_source')
      ? { utmSource: params.get('utm_source')!.slice(0, 100) }
      : {}),
    engaged,
    events,
  });
  firstBeat = false;
  const blob = new Blob([body], { type: 'text/plain' });
  if (!navigator.sendBeacon?.('/api/track', blob))
    void fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(
      () => {},
    );
}

export function VisitTracker() {
  const pathname = usePathname();
  const active = !pathname.startsWith('/admin');

  useEffect(() => {
    if (!active || optedOut()) return;
    if (lastView.path !== pathname || Date.now() - lastView.at > 1000) {
      lastView = { path: pathname, at: Date.now() };
      queue.push({ type: 'pageview', path: pathname });
      flush();
    }
    const reached = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      const depth = (scrollY / max) * 100;
      for (const mark of [25, 50, 75, 100])
        if (depth >= mark - 1 && !reached.has(mark)) {
          reached.add(mark);
          queue.push({ type: 'scroll', path: pathname, label: `${mark}%` });
        }
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [active, pathname]);

  useEffect(() => {
    if (!active || optedOut()) return;
    visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest?.(
        'a, button, [data-track]',
      );
      if (!target) return;
      const href = target instanceof HTMLAnchorElement ? target.href : '';
      const outbound = href && new URL(href).host !== location.host;
      queue.push({
        type: outbound ? 'outbound' : 'click',
        path: location.pathname,
        label: outbound ? new URL(href).host : labelOf(target),
      });
      if (outbound) flush();
    };
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      queue.push({
        type: 'form',
        path: location.pathname,
        label: form.getAttribute('aria-label') || form.id || 'Form',
      });
      flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') visibleSince = Date.now();
      else flush();
    };
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') flush();
    }, BEAT_MS);
    document.addEventListener('click', onClick, { capture: true });
    document.addEventListener('submit', onSubmit, { capture: true });
    document.addEventListener('visibilitychange', onVisibility);
    addEventListener('pagehide', flush);
    return () => {
      clearInterval(timer);
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('submit', onSubmit, { capture: true });
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('pagehide', flush);
      flush();
      visibleSince = null;
    };
  }, [active]);

  return null;
}

export function SkipOwnVisits() {
  useEffect(() => {
    try {
      localStorage.setItem(OPT_OUT_KEY, '1');
    } catch {
      /* Private mode: nothing to remember. */
    }
  }, []);
  return null;
}
