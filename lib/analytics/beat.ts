import { z } from 'zod';

const pathSchema = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine((path) => path.startsWith('/'), 'Expected a site path.');
export const visitEventSchema = z
  .object({
    type: z.enum(['pageview', 'click', 'outbound', 'scroll', 'form']),
    path: pathSchema,
    label: z.string().trim().max(160).optional(),
  })
  .strict();
// One beacon from the browser tracker: a batch of events plus the engaged seconds since the last beacon.
export const beatSchema = z
  .object({
    session: z.uuid(),
    path: pathSchema,
    referrer: z.string().max(2000).optional(),
    utmSource: z.string().trim().max(100).optional(),
    engaged: z.number().int().min(0).max(3600).default(0),
    events: z.array(visitEventSchema).max(30).default([]),
  })
  .strict();
export type Beat = z.infer<typeof beatSchema>;

const botPattern =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|curl|wget|python|axios|node-fetch|go-http/i;
export function isBot(userAgent: string) {
  return !userAgent || botPattern.test(userAgent);
}
export function describeAgent(userAgent: string) {
  const device = /ipad|tablet|kindle|silk/i.test(userAgent)
    ? 'tablet'
    : /mobi|iphone|android/i.test(userAgent)
      ? 'mobile'
      : /windows|macintosh|linux|cros/i.test(userAgent)
        ? 'desktop'
        : 'unknown';
  const browser = /edg\//i.test(userAgent)
    ? 'Edge'
    : /opr\/|opera/i.test(userAgent)
      ? 'Opera'
      : /firefox|fxios/i.test(userAgent)
        ? 'Firefox'
        : /chrome|crios/i.test(userAgent)
          ? 'Chrome'
          : /safari/i.test(userAgent)
            ? 'Safari'
            : undefined;
  const os = /iphone|ipad|ios/i.test(userAgent)
    ? 'iOS'
    : /android/i.test(userAgent)
      ? 'Android'
      : /windows/i.test(userAgent)
        ? 'Windows'
        : /mac os|macintosh/i.test(userAgent)
          ? 'macOS'
          : /cros/i.test(userAgent)
            ? 'ChromeOS'
            : /linux/i.test(userAgent)
              ? 'Linux'
              : undefined;
  return { device, browser, os } as const;
}
// Keeps only the referring host, and drops it when the visitor came from this site.
export function referrerHost(referrer: string | undefined, ownHost: string) {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (!host || host === ownHost.replace(/^www\./, '')) return undefined;
    return host.slice(0, 200);
  } catch {
    return undefined;
  }
}
