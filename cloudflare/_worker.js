import { nativeApiRequest } from './api.mjs';

const BODY_LIMIT = 131072;

function error(status, code, message) {
  return Response.json({ error: { code, message } }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

async function limitedBody(request) {
  if (!request.body) return undefined;
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > BODY_LIMIT) {
      await reader.cancel().catch(() => {});
      throw new Error('BODY_TOO_LARGE');
    }
    chunks.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return body;
}

export async function proxyRequest(request, env, { fetchImpl = globalThis.fetch } = {}) {
  const incoming = new URL(request.url);
  if (!incoming.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  if (!env.HF_SPACE_URL) return nativeApiRequest(request, env, { fetchImpl });
  if (!['GET', 'HEAD', 'POST'].includes(request.method)) return error(405, 'METHOD_NOT_ALLOWED', 'این درخواست مجاز نیست.');
  const origin = request.headers.get('Origin');
  // Do not turn the proxy into a cross-origin relay by blindly rewriting an untrusted Origin.
  if (origin && origin !== incoming.origin) return error(403, 'ORIGIN_NOT_ALLOWED', 'ارسال درخواست از این نشانی مجاز نیست.');
  let backend;
  try {
    backend = new URL(env.HF_SPACE_URL);
    if (backend.protocol !== 'https:' || !backend.hostname.endsWith('.hf.space') || backend.username || backend.password || backend.port || backend.pathname !== '/' || backend.search || backend.hash) throw new Error();
  } catch {
    return error(503, 'BACKEND_NOT_CONFIGURED', 'نشانی سرور Hugging Face هنوز تنظیم نشده است.');
  }
  if (Number(request.headers.get('Content-Length') || 0) > BODY_LIMIT) return error(413, 'BODY_TOO_LARGE', 'حجم درخواست بیش از حد مجاز است.');
  const headers = new Headers({ Accept: 'application/json', 'Accept-Encoding': 'identity' });
  for (const name of ['Content-Type', 'X-App-Key']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (origin) headers.set('Origin', backend.origin);
  // Only the Cloudflare-provided client IP is accepted, never caller-supplied forwarding headers.
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (env.PROXY_SHARED_SECRET && clientIp) {
    headers.set('X-Bridge-Proxy-Key', env.PROXY_SHARED_SECRET);
    headers.set('X-Bridge-Client-IP', clientIp);
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  request.signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 55000);
  try {
    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await limitedBody(request);
    const target = new URL(incoming.pathname + incoming.search, backend.origin);
    const response = await fetchImpl(target.toString(), {
      method: request.method, headers, body, signal: controller.signal, redirect: 'manual',
    });
    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel().catch(() => {});
      return error(502, 'BACKEND_REDIRECT', 'سرور مدل در دسترس نیست. لطفاً کمی بعد تلاش کنید.');
    }
    if (!response.headers.get('Content-Type')?.includes('application/json')) {
      await response.body?.cancel().catch(() => {});
      return error(502, 'BACKEND_STARTING', 'سرور Hugging Face ممکن است در حال راه‌اندازی باشد. کمی بعد تلاش کنید.');
    }
    const responseHeaders = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    });
    const retry = response.headers.get('Retry-After');
    if (retry) responseHeaders.set('Retry-After', retry);
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch (reason) {
    if (reason?.message === 'BODY_TOO_LARGE') return error(413, 'BODY_TOO_LARGE', 'حجم درخواست بیش از حد مجاز است.');
    return error(controller.signal.aborted ? 504 : 502, 'BACKEND_UNAVAILABLE', 'ارتباط با سرور Hugging Face برقرار نشد. لطفاً دوباره تلاش کنید.');
  } finally {
    clearTimeout(timer);
    request.signal?.removeEventListener('abort', abort);
  }
}

export default { fetch: (request, env) => proxyRequest(request, env) };
