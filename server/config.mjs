import { AppError } from './errors.mjs';

export const LIMITS = Object.freeze({
  maxMessages: 11,
  maxMessageChars: 4000,
  maxTotalChars: 24000,
  maxBodyBytes: 131072,
  sessionMinutes: 30,
  maxSessions: 500,
});

function number(env, key, fallback, min, max) {
  const value = env[key] === undefined || env[key] === '' ? fallback : Number(env[key]);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${key} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

function boolean(env, key, fallback) {
  if (env[key] === undefined || env[key] === '') return fallback;
  if (!['true', 'false'].includes(env[key])) throw new Error(`${key} must be true or false.`);
  return env[key] === 'true';
}

export function getConfig(env = process.env) {
  const telegramToken = (env.TELEGRAM_BOT_TOKEN || '').trim();
  const telegramUsername = (env.TELEGRAM_BOT_USERNAME || '').trim().replace(/^@/, '');
  const adminChatId = (env.TELEGRAM_ADMIN_CHAT_ID || '').trim();
  const telegramAllowedIds = (env.TELEGRAM_ALLOWED_USER_IDS || '').split(',').map(v => v.trim()).filter(Boolean);
  if (telegramUsername && !/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(telegramUsername)) {
    throw new Error('TELEGRAM_BOT_USERNAME must be a valid Telegram username, without a URL.');
  }
  if (adminChatId && !/^-?\d+$/.test(adminChatId)) throw new Error('TELEGRAM_ADMIN_CHAT_ID must be a numeric chat ID.');
  if (telegramAllowedIds.some(id => !/^\d+$/.test(id))) throw new Error('TELEGRAM_ALLOWED_USER_IDS must contain numeric user IDs.');
  const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  for (const value of allowedOrigins) {
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== value) throw new Error();
    } catch {
      throw new Error('ALLOWED_ORIGINS must contain exact http(s) origins, separated by commas.');
    }
  }
  return Object.freeze({
    port: number(env, 'PORT', 7860, 1, 65535),
    hfToken: (env.HF_TOKEN || '').trim(),
    hfModel: (env.HF_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507').trim(),
    hfTimeoutMs: number(env, 'HF_TIMEOUT_MS', 45000, 1000, 120000),
    hfMaxTokens: number(env, 'HF_MAX_TOKENS', 800, 64, 2048),
    maxConcurrentAi: number(env, 'AI_MAX_CONCURRENT', 4, 1, 16),
    globalAiPerMinute: number(env, 'AI_GLOBAL_REQUESTS_PER_MINUTE', 30, 1, 300),
    webAiPerMinute: number(env, 'WEB_REQUESTS_PER_MINUTE', 8, 1, 60),
    webAccessToken: (env.WEB_ACCESS_TOKEN || '').trim(),
    proxySharedSecret: (env.PROXY_SHARED_SECRET || '').trim(),
    telegramToken,
    telegramUsername,
    adminChatId,
    telegramPollingEnabled: boolean(env, 'TELEGRAM_POLLING_ENABLED', Boolean(telegramToken)),
    telegramAllowedIds,
    trustProxy: boolean(env, 'TRUST_PROXY', false),
    allowedOrigins,
  });
}

export function requireConsent(consent) {
  if (consent !== true) throw new AppError(400, 'CONSENT_REQUIRED', 'پیش از ارسال، لطفاً توضیح حریم خصوصی را بخوانید و رضایت خود را اعلام کنید.');
}
