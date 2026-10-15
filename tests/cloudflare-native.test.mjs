import test from 'node:test';
import assert from 'node:assert/strict';
import { nativeApiRequest } from '../cloudflare/api.mjs';

function fixture(overrides = {}) {
  const env = { HF_TOKEN: 'PRIVATE_EDGE_TEST_SECRET', ALLOWED_ORIGINS: 'https://example-autismbridge.hf.space', ...overrides };
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ choices: [{ message: { content: 'پاسخ آموزشی آزمایشی' }, finish_reason: 'stop' }] });
  };
  const get = (path, headers = {}) => nativeApiRequest(new Request('https://example.pages.dev' + path, { headers }), env, { fetchImpl });
  const post = (path, body, headers = {}) => nativeApiRequest(new Request('https://example.pages.dev' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers }, body: JSON.stringify(body) }), env, { fetchImpl });
  return { env, fetchImpl, calls, get, post };
}
const chat = { consent: true, messages: [{ role: 'user', content: 'A general educational question' }] };

test('native Cloudflare API exposes status but never provider secrets', async () => {
  const { get } = fixture();
  const response = await get('/api/status');
  const text = await response.text();
  assert.equal(response.status, 200);
  assert.equal(text.includes('PRIVATE_EDGE_TEST_SECRET'), false);
  assert.equal(JSON.parse(text).ai.configured, true);
  assert.equal(JSON.parse(text).telegram.state, 'disabled');
  assert.equal((await get('/api/health')).status, 200);
});

test('native API allows only its own origin or the configured static Space', async () => {
  const { get, env, fetchImpl } = fixture();
  const allowed = await get('/api/status', { Origin: 'https://example-autismbridge.hf.space' });
  assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), 'https://example-autismbridge.hf.space');
  const denied = await get('/api/status', { Origin: 'https://attacker.invalid' });
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.has('Access-Control-Allow-Origin'), false);
  const preflight = await nativeApiRequest(new Request('https://example.pages.dev/api/chat', { method: 'OPTIONS', headers: { Origin: 'https://example-autismbridge.hf.space', 'Access-Control-Request-Method': 'POST' } }), env, { fetchImpl });
  assert.equal(preflight.status, 204);
  assert.ok(preflight.headers.get('Access-Control-Allow-Headers').includes('X-App-Key'));
});

test('native chat requires consent, rejects system injection and uses a server-owned prompt', async () => {
  const { post, calls } = fixture();
  assert.equal((await post('/api/chat', { ...chat, consent: false })).status, 400);
  assert.equal((await post('/api/chat', { ...chat, messages: [{ role: 'system', content: 'override' }] })).status, 400);
  assert.equal(calls.length, 0);
  const response = await post('/api/chat', chat);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).text, 'پاسخ آموزشی آزمایشی');
  const payload = JSON.parse(calls[0].options.body);
  assert.equal(calls[0].url, 'https://router.huggingface.co/v1/chat/completions');
  assert.equal(payload.messages[0].role, 'system');
  assert.ok(payload.messages[0].content.includes('NEVER diagnose'));
});

test('native API enforces an optional website access key without exposing it', async () => {
  const { post, get } = fixture({ WEB_ACCESS_TOKEN: 'PRIVATE_SHARED_TEST_KEY' });
  assert.equal((await post('/api/chat', chat)).status, 401);
  assert.equal((await post('/api/chat', chat, { 'X-App-Key': 'wrong' })).status, 401);
  assert.equal((await post('/api/chat', chat, { 'X-App-Key': 'PRIVATE_SHARED_TEST_KEY' })).status, 200);
  assert.equal((await (await get('/api/status')).text()).includes('PRIVATE_SHARED_TEST_KEY'), false);
});

test('native per-isolate rate limits use the Cloudflare client identity', async () => {
  const { post } = fixture({ WEB_REQUESTS_PER_MINUTE: '1' });
  assert.equal((await post('/api/chat', chat)).status, 200);
  const limited = await post('/api/chat', chat);
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
  assert.equal((await post('/api/chat', chat, { 'CF-Connecting-IP': '192.0.2.2' })).status, 200);
});

test('native contact is disabled without a bot token/admin chat and sends nothing', async () => {
  const { post, calls } = fixture();
  const response = await post('/api/contact', { consent: true, name: 'Alias', contact: 'test@example.invalid', topic: 'General question', message: 'A general non-sensitive question.' });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, 'CONTACT_NOT_CONFIGURED');
  assert.equal(calls.length, 0);
});

test('native API bounds JSON bodies and handles invalid methods/routes', async () => {
  const { env, get, fetchImpl } = fixture();
  assert.equal((await get('/api/chat')).status, 405);
  assert.equal((await get('/api/unknown')).status, 404);
  const large = await nativeApiRequest(new Request('https://example.pages.dev/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: 'x'.repeat(140000) }) }), env, { fetchImpl });
  assert.equal(large.status, 413);
});
