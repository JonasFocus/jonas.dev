export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const allowed = [process.env.APP_URL, process.env.DEPLOYMENT_ORIGIN];
  if (process.env.VERCEL) {
    for (const host of [
      process.env.VERCEL_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ]) {
      if (host) allowed.push(`https://${host}`);
    }
  } else if (process.env.NODE_ENV !== 'production' && !process.env.APP_URL) {
    allowed.push(new URL(request.url).origin);
  }
  return allowed.includes(origin);
}
