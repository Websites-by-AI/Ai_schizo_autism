import { getConfig, LIMITS, requireConsent } from '../server/config.mjs';
import { AppError, publicError } from '../server/errors.mjs';
import { createHuggingFace } from '../server/huggingface.mjs';
import { WindowLimiter, enforceLimit } from '../server/limits.mjs';
import { validateContact, validateMessages } from '../server/validation.mjs';

const instances = new WeakMap();

function runtime(env, fetchImpl) {
  if (!instances.has(env)) {
    const config = getConfig(env);
    instances.set(env, {
      config,
      ai: createHuggingFace(config, { fetchImpl }),
      abuse: new WindowLimiter({ limit: 60 }),
      chat: new WindowLimiter({ limit: config.webAiPerMinute }),
      contact: new WindowLimiter({ limit: 3, windowMs: 3600000 }),
      allContact: new WindowLimiter({ limit: 20, windowMs: 3600000 }),
    });
  }
  return instances.get(env);
}

async function sameSecret(actual, expected) {
  if (typeof actual !== 'string') return false;
  const encode = new TextEncoder();
  const digest = async text => new Uint8Array(await crypto.subtle.digest('SHA-256', encode.encode(text)));
  const [left, right] = await Promise.all([digest(actual), digest(expected)]);
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function readJson(request) {
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) throw new AppError(415, 'JSON_REQUIRED', 'نوع درخواست باید JSON باشد.');
  if (Number(request.headers.get('Content-Length') || 0) > LIMITS.maxBodyBytes) throw new AppError(413, 'BODY_TOO_LARGE', 'حجم درخواست بیش از حد مجاز است.');
  const reader = request.body?.getReader();
  if (!reader) throw new AppError(400, 'INVALID_JSON', 'داده‌های درخواست معتبر نیست.');
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > LIMITS.maxBodyBytes) {
      await reader.cancel().catch(() => {});
      throw new AppError(413, 'BODY_TOO_LARGE', 'حجم درخواست بیش از حد مجاز است.');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const value of chunks) { bytes.set(value, offset); offset += value.byteLength; }
  try {
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new AppError(400, 'INVALID_JSON', 'داده‌های درخواست معتبر نیست.');
  }
}

export async function nativeApiRequest(request, env, { fetchImpl = globalThis.fetch } = {}) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const extraOrigins = String(env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
  const originAllowed = !origin || origin === url.origin || extraOrigins.includes(origin);
  const cors = originAllowed && origin ? {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-App-Key',
    'Access-Control-Max-Age': '600', Vary: 'Origin',
  } : {};
  const json = (status, value, extra = {}) => Response.json(value, {
    status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...cors, ...extra },
  });
  try {
    if (!originAllowed) throw new AppError(403, 'ORIGIN_NOT_ALLOWED', 'ارسال درخواست از این نشانی مجاز نیست.');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const { config, ai, abuse, chat, contact, allContact } = runtime(env, fetchImpl);
    if (request.method === 'GET' && url.pathname === '/api/health') return json(200, { ok: true, platform: 'cloudflare' });
    if (request.method === 'GET' && url.pathname === '/api/status') {
      return json(200, {
        ai: { configured: Boolean(config.hfToken), model: config.hfModel },
        telegram: {
          configured: Boolean(config.telegramToken), state: 'disabled',
          username: config.telegramUsername || null,
          url: config.telegramUsername ? `https://t.me/${config.telegramUsername}` : null,
        },
        contact: { enabled: Boolean(config.telegramToken && config.adminChatId) },
        webAccessRequired: Boolean(config.webAccessToken), limits: LIMITS,
      });
    }
    if (!['/api/chat', '/api/contact'].includes(url.pathname)) throw new AppError(404, 'NOT_FOUND', 'این سرویس وجود ندارد.');
    if (request.method !== 'POST') throw new AppError(405, 'METHOD_NOT_ALLOWED', 'از درخواست POST استفاده کنید.');
    // This header is supplied/overwritten by Cloudflare in production, not trusted from a forwarding header.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown-client';
    enforceLimit(abuse, ip);
    if (url.pathname === '/api/chat' && config.webAccessToken && !await sameSecret(request.headers.get('X-App-Key'), config.webAccessToken)) {
      throw new AppError(401, 'ACCESS_KEY_REQUIRED', 'کلید دسترسی سایت وارد نشده یا درست نیست.');
    }
    const body = await readJson(request);
    requireConsent(body.consent);
    if (url.pathname === '/api/chat') {
      const messages = validateMessages(body.messages);
      enforceLimit(chat, ip);
      return json(200, await ai.chat(messages, { signal: request.signal }));
    }
    const form = validateContact(body);
    if (!config.telegramToken || !config.adminChatId) throw new AppError(503, 'CONTACT_NOT_CONFIGURED', 'دریافت پیام هنوز تنظیم نشده است. مدیر سایت باید توکن ربات و شناسه گفتگوی مدیر را وارد کند.');
    enforceLimit(contact, ip);
    enforceLimit(allContact, 'all-contact-requests');
    const text = `پیام تازه از وب‌سایت پل اوتیسم\n\nنام یا نام مستعار: ${form.name}\nراه تماس: ${form.contact}\nموضوع: ${form.topic}\n\n${form.message}\n\nکاربر با ارسال این اطلاعات به مدیر از طریق تلگرام موافقت کرده است.`;
    try {
      const response = await fetchImpl(`https://api.telegram.org/bot${config.telegramToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: config.adminChatId, text, link_preview_options: { is_disabled: true } }),
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
      });
      const data = await response.json();
      if (!response.ok || data?.ok !== true) throw new Error();
    } catch {
      throw new AppError(502, 'CONTACT_DELIVERY_FAILED', 'تلگرام دریافت پیام را تأیید نکرد. ارسال موفق نبود؛ لطفاً بعداً تلاش کنید.');
    }
    return json(200, { ok: true });
  } catch (reason) {
    const safe = publicError(reason);
    return json(safe.status, { error: { code: safe.code, message: safe.message } }, safe.retryAfter ? { 'Retry-After': String(safe.retryAfter) } : {});
  }
}
