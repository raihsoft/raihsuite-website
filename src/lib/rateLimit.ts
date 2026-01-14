const hits = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 20;

export function rateLimitCheck(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry) {
    hits.set(key, { count: 1, first: now });
    return false;
  }
  if (now - entry.first > WINDOW_MS) {
    hits.set(key, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_HITS) return true;
  return false;
}