import test from 'node:test';
import assert from 'node:assert/strict';
import { proxyRequest } from '../cloudflare/_worker.js';

const env = { HF_SPACE_URL: 'https://example-autismbridge.hf.space', PROXY_SHARED_SECRET: 'test-proxy-secret' };

test('Cloudflare serves static assets without contacting the AI backend', async () => {
  const result = await proxyRequest(new Request('https://example.pages.dev/'), { ...env, ASSETS: { fetch: async () => new Response('static website') } });
  assert.equal(await result.text(), 'static website');
});

test('Cloudflare forwards only API headers and authenticates the trusted client IP', async () => {
  let received;
  const request = new Request('https://example.pages.dev/api/chat', {
    method: 'POST', headers: {
      Origin: 'https://example.pages.dev', 'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.10', 'X-Forwarded-For': 'spoofed',
      'X-Bridge-Proxy-Key': 'spoofed', 'X-App-Key': 'visitor-key',
      Authorization: 'Bearer must-not-forward', Cookie: 'private=must-not-forward',
    }, body: JSON.stringify({ consent: true, messages: [{ role: 'user', content: 'hello' }] }),
  });
  const response = await proxyRequest(request, env, { fetchImpl: async (url, options) => {
    received = { url, options };
    return Response.json({ text: 'educational response' });
  } });
  assert.equal(response.status, 200);
  assert.equal(received.url, env.HF_SPACE_URL + '/api/chat');
  assert.equal(received.options.headers.get('Origin'), env.HF_SPACE_URL);
  assert.equal(received.options.headers.get('X-Bridge-Client-IP'), '192.0.2.10');
  assert.equal(received.options.headers.get('X-Bridge-Proxy-Key'), 'test-proxy-secret');
  assert.equal(received.options.headers.get('X-App-Key'), 'visitor-key');
  assert.equal(received.options.headers.has('Authorization'), false);
  assert.equal(received.options.headers.has('Cookie'), false);
  assert.equal(received.options.headers.has('X-Forwarded-For'), false);
  assert.equal(received.options.redirect, 'manual');
});

test('Cloudflare rejects cross-origin callers and non-Hugging Face upstreams', async () => {
  let fetched = false;
  const options = { fetchImpl: async () => { fetched = true; return Response.json({}); } };
  const crossSite = await proxyRequest(new Request('https://example.pages.dev/api/chat', { method: 'POST', headers: { Origin: 'https://untrusted.invalid' } }), env, options);
  assert.equal(crossSite.status, 403);
  for (const url of ['http://example.hf.space', 'https://attacker.invalid', 'https://attacker.invalid/?x=.hf.space', 'https://x.hf.space/private']) {
    assert.equal((await proxyRequest(new Request('https://example.pages.dev/api/status'), { HF_SPACE_URL: url }, options)).status, 503);
  }
  assert.equal(fetched, false);
});

test('Cloudflare does not follow upstream redirects or display upstream HTML errors', async () => {
  const request = () => new Request('https://example.pages.dev/api/status');
  const redirect = await proxyRequest(request(), env, { fetchImpl: async () => new Response('', { status: 302, headers: { Location: 'https://untrusted.invalid' } }) });
  assert.equal(redirect.status, 502);
  const html = await proxyRequest(request(), env, { fetchImpl: async () => new Response('<html>upstream private error</html>', { status: 503, headers: { 'Content-Type': 'text/html' } }) });
  assert.equal(html.status, 502);
  assert.equal((await html.text()).includes('upstream private error'), false);
});

test('Cloudflare preserves rate-limit errors but not upstream cookies', async () => {
  const response = await proxyRequest(new Request('https://example.pages.dev/api/chat'), env, { fetchImpl: async () => Response.json({ error: { code: 'RATE_LIMITED' } }, { status: 429, headers: { 'Retry-After': '30', 'Set-Cookie': 'private=value' } }) });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '30');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.has('Set-Cookie'), false);
});

test('Cloudflare bounds request bodies even when content length is not supplied', async () => {
  const response = await proxyRequest(new Request('https://example.pages.dev/api/chat', { method: 'POST', body: 'x'.repeat(140000) }), env, { fetchImpl: async () => { throw new Error('must not fetch'); } });
  assert.equal(response.status, 413);
});
