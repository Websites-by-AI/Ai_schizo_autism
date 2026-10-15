import { createHash, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { LIMITS, requireConsent } from './config.mjs';
import { AppError, publicError } from './errors.mjs';
import { WindowLimiter, enforceLimit } from './limits.mjs';
import { validateContact, validateMessages } from './validation.mjs';

function json(res, status, value, headers = {}) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(value));
}

function sameSecret(actual, expected) {
  const hash = value => createHash('sha256').update(value).digest();
  return typeof actual === 'string' && timingSafeEqual(hash(actual), hash(expected));
}

function assertOrigin(req, config) {
  const origin = req.headers.origin;
  if (!origin) return; // Non-browser clients still require the optional access key and rate limits.
  let sameHost = false;
  try {
    const parsed = new URL(origin);
    sameHost = ['http:', 'https:'].includes(parsed.protocol) && parsed.host.toLowerCase() === String(req.headers.host || '').toLowerCase();
  } catch { /* Invalid origins are rejected below. */ }
  if (!sameHost && !config.allowedOrigins.includes(origin)) {
    throw new AppError(403, 'ORIGIN_NOT_ALLOWED', 'ارسال درخواست از این نشانی مجاز نیست.');
  }
}

function readJson(req) {
  if (!(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new AppError(415, 'JSON_REQUIRED', 'نوع درخواست باید JSON باشد.');
  }
  return new Promise((resolve, reject) => {
    let size = 0;
    let chunks = [];
    let settled = false;
    const fail = error => {
      if (settled) return;
      settled = true;
      chunks = [];
      reject(error);
      req.resume();
    };
    req.on('data', chunk => {
      if (settled) return;
      size += chunk.length;
      if (size > LIMITS.maxBodyBytes) return fail(new AppError(413, 'BODY_TOO_LARGE', 'حجم درخواست بیش از حد مجاز است.'));
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (settled) return;
      settled = true;
      try {
        const result = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error();
        resolve(result);
      } catch {
        reject(new AppError(400, 'INVALID_JSON', 'داده‌های درخواست معتبر نیست.'));
      }
    });
    req.on('error', () => fail(new AppError(400, 'REQUEST_ERROR', 'دریافت درخواست کامل نشد.')));
    req.on('aborted', () => fail(new AppError(400, 'REQUEST_ERROR', 'دریافت درخواست متوقف شد.')));
  });
}

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

async function serveStatic(req, res, pathname, root) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { throw new AppError(400, 'INVALID_PATH', 'نشانی معتبر نیست.'); }
  if (decoded.includes('\0') || decoded.includes('\\') || decoded.split('/').some(part => part.startsWith('.'))) {
    throw new AppError(404, 'NOT_FOUND', 'صفحه پیدا نشد.');
  }
  let filename = path.resolve(root, '.' + decoded);
  if (filename !== root && !filename.startsWith(root + path.sep)) throw new AppError(404, 'NOT_FOUND', 'صفحه پیدا نشد.');
  let info = await stat(filename).catch(() => null);
  if (info?.isDirectory()) {
    filename = path.join(filename, 'index.html');
    info = await stat(filename).catch(() => null);
  }
  if (!info?.isFile() && !path.extname(decoded)) {
    filename = path.join(root, 'index.html');
    info = await stat(filename).catch(() => null);
  }
  if (!info?.isFile()) throw new AppError(404, 'NOT_FOUND', 'صفحه پیدا نشد.');
  res.writeHead(200, {
    'Content-Type': CONTENT_TYPES[path.extname(filename)] || 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': path.extname(filename) === '.html' ? 'no-cache' : 'public, max-age=3600',
  });
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(filename);
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}

export function createHttpHandler({ config, ai, telegram, staticRoot, middleware, log = console.error }) {
  const chatLimiter = new WindowLimiter({ limit: config.webAiPerMinute });
  const contactLimiter = new WindowLimiter({ limit: 3, windowMs: 3600000 });
  const globalContactLimiter = new WindowLimiter({ limit: 20, windowMs: 3600000 });
  const abuseLimiter = new WindowLimiter({ limit: 60 });
  const root = staticRoot ? path.resolve(staticRoot) : null;

  return async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    const requestController = new AbortController();
    res.once('close', () => { if (!res.writableEnded) requestController.abort(); });
    try {
      const { pathname } = new URL(req.url || '/', 'http://internal.invalid');
      if (pathname === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true });
      if (pathname === '/api/status' && req.method === 'GET') {
        return json(res, 200, {
          ai: { configured: Boolean(config.hfToken), model: config.hfModel },
          telegram: telegram.status(),
          contact: { enabled: Boolean(config.telegramToken && config.adminChatId) },
          webAccessRequired: Boolean(config.webAccessToken),
          limits: LIMITS,
        });
      }
      if (pathname === '/api/chat' || pathname === '/api/contact') {
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST');
          throw new AppError(405, 'METHOD_NOT_ALLOWED', 'از درخواست POST استفاده کنید.');
        }
        assertOrigin(req, config);
        const forwarded = req.headers['x-forwarded-for'];
        // Trust only an explicitly configured, single reverse-proxy hop.
        const bridgeIp = req.headers['x-bridge-client-ip'];
        const verifiedBridge = config.proxySharedSecret && sameSecret(req.headers['x-bridge-proxy-key'], config.proxySharedSecret);
        const ip = verifiedBridge && typeof bridgeIp === 'string' && isIP(bridgeIp)
          ? bridgeIp
          : config.trustProxy && typeof forwarded === 'string'
            ? forwarded.split(',').at(-1).trim() || req.socket.remoteAddress
            : req.socket.remoteAddress;
        enforceLimit(abuseLimiter, ip);
        if (pathname === '/api/chat' && config.webAccessToken && !sameSecret(req.headers['x-app-key'], config.webAccessToken)) {
          throw new AppError(401, 'ACCESS_KEY_REQUIRED', 'کلید دسترسی سایت وارد نشده یا درست نیست.');
        }
        const body = await readJson(req);
        requireConsent(body.consent);
        if (pathname === '/api/chat') {
          const messages = validateMessages(body.messages);
          enforceLimit(chatLimiter, ip);
          const response = await ai.chat(messages, { signal: requestController.signal });
          return json(res, 200, response);
        }
        const form = validateContact(body);
        if (!config.telegramToken || !config.adminChatId) {
          throw new AppError(503, 'CONTACT_NOT_CONFIGURED', 'دریافت پیام هنوز تنظیم نشده است. مدیر سایت باید توکن ربات و شناسه گفتگوی مدیر را وارد کند.');
        }
        enforceLimit(contactLimiter, ip);
        enforceLimit(globalContactLimiter, 'all-contact-requests');
        const text = `پیام تازه از وب‌سایت پل اوتیسم\n\nنام یا نام مستعار: ${form.name}\nراه تماس: ${form.contact}\nموضوع: ${form.topic}\n\n${form.message}\n\nکاربر با ارسال این اطلاعات به مدیر از طریق تلگرام موافقت کرده است.`;
        try {
          await telegram.client.sendText(config.adminChatId, text, { signal: requestController.signal });
        } catch {
          throw new AppError(502, 'CONTACT_DELIVERY_FAILED', 'تلگرام دریافت پیام را تأیید نکرد. ارسال موفق نبود؛ لطفاً بعداً تلاش کنید.');
        }
        return json(res, 200, { ok: true });
      }
      if (pathname.startsWith('/api/')) throw new AppError(404, 'NOT_FOUND', 'این سرویس وجود ندارد.');
      if (req.method !== 'GET' && req.method !== 'HEAD') throw new AppError(405, 'METHOD_NOT_ALLOWED', 'این درخواست مجاز نیست.');
      if (middleware) return middleware(req, res, () => json(res, 404, { error: { code: 'NOT_FOUND', message: 'صفحه پیدا نشد.' } }));
      if (root) return await serveStatic(req, res, pathname, root);
      throw new AppError(404, 'NOT_FOUND', 'صفحه پیدا نشد.');
    } catch (error) {
      const safe = publicError(error);
      if (!(error instanceof AppError)) log('Server: an unexpected request error occurred.');
      return json(res, safe.status, { error: { code: safe.code, message: safe.message } }, safe.retryAfter ? { 'Retry-After': String(safe.retryAfter) } : {});
    }
  };
}
