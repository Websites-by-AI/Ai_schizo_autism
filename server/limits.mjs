import { AppError } from './errors.mjs';

export class WindowLimiter {
  constructor({ limit, windowMs = 60000, maxKeys = 2048, now = Date.now }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.maxKeys = maxKeys;
    this.now = now;
    this.entries = new Map();
  }

  take(key) {
    const now = this.now();
    for (const [id, entry] of this.entries) {
      if (entry.until <= now) this.entries.delete(id);
    }
    let entry = this.entries.get(key);
    if (!entry) {
      if (this.entries.size >= this.maxKeys) this.entries.delete(this.entries.keys().next().value);
      entry = { count: 0, until: now + this.windowMs };
      this.entries.set(key, entry);
    }
    if (entry.count >= this.limit) {
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.until - now) / 1000)) };
    }
    entry.count++;
    return { allowed: true, retryAfter: 0 };
  }
}

export function enforceLimit(limiter, key) {
  const result = limiter.take(key);
  if (!result.allowed) {
    throw new AppError(429, 'RATE_LIMITED', 'تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید و دوباره تلاش کنید.', result.retryAfter);
  }
}
