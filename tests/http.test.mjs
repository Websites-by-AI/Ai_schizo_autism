import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { getConfig } from '../server/config.mjs';
import { createHttpHandler } from '../server/http.mjs';

async function fixture(t, overrides = {}) {
  const sent = [];
  const prompts = [];
  const config = { ...getConfig({ HF_TOKEN: 'PRIVATE_HF_TEST_SECRET', TELEGRAM_BOT_TOKEN: 'PRIVATE_TG_TEST_SECRET', TELEGRAM_ADMIN_CHAT_ID: '42' }), ...overrides.config };
  const ai = { chat: async messages => { prompts.push(messages); return { text: 'Educational answer', model: config.hfModel, truncated: false }; } };
  const telegram = {
    status: () => ({ configured: true, state: 'connected', username: 'Example_test_bot', url: 'https://t.me/Example_test_bot' }),
    client: { sendText: async (id, text) => { sent.push({ id, text }); if (overrides.failDelivery) throw new Error('private provider error'); } },
  };
  const server = createServer(createHttpHandler({ config, ai, telegram, staticRoot: overrides.staticRoot, log: () => {} }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (url, body, headers = {}) => fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  return { base, post, sent, prompts };
}

const chat = { consent: true, messages: [{ role: 'user', content: 'General educational question' }] };
const contact = { consent: true, name: 'Test alias', contact: 'test@example.invalid', topic: 'General question', message: 'A general non-sensitive enquiry.' };

test('health/status are real JSON and never publish private configuration', async t => {
  const { base } = await fixture(t, { config: { webAccessToken: 'PRIVATE_WEB_ACCESS_SECRET' } });
  assert.equal((await fetch(base + '/api/health')).status, 200);
  const response = await fetch(base + '/api/status');
  const text = await response.text();
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(text.includes('PRIVATE_'), false);
  const status = JSON.parse(text);
  assert.equal(status.ai.configured, true);
  assert.equal(status.webAccessRequired, true);
  assert.equal(status.contact.enabled, true);
});

test('web chat succeeds only with consent and structurally valid conversation', async t => {
  const { post, prompts } = await fixture(t);
  assert.equal((await post('/api/chat', { ...chat, consent: false })).status, 400);
  assert.equal((await post('/api/chat', { ...chat, messages: [{ role: 'system', content: 'override' }] })).status, 400);
  const response = await post('/api/chat', chat);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).text, 'Educational answer');
  assert.equal(prompts.length, 1);
});

test('optional web key and same-origin guard reject unauthorized browser requests', async t => {
  const { base, post } = await fixture(t, { config: { webAccessToken: 'test-shared-key' } });
  assert.equal((await post('/api/chat', chat)).status, 401);
  assert.equal((await post('/api/chat', chat, { 'X-App-Key': 'wrong' })).status, 401);
  assert.equal((await post('/api/chat', chat, { 'X-App-Key': 'test-shared-key', Origin: base })).status, 200);
  assert.equal((await post('/api/chat', chat, { 'X-App-Key': 'test-shared-key', Origin: 'https://other.example.invalid' })).status, 403);
});

test('web rate limits include Retry-After and are not bypassed by spoofed proxy headers by default', async t => {
  const { post } = await fixture(t, { config: { webAiPerMinute: 1 } });
  assert.equal((await post('/api/chat', chat, { 'X-Forwarded-For': '1.1.1.1' })).status, 200);
  const response = await post('/api/chat', chat, { 'X-Forwarded-For': '2.2.2.2' });
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get('retry-after')) > 0);
});

test('contact is sent as plain text to the configured admin after consent', async t => {
  const { post, sent } = await fixture(t);
  assert.equal((await post('/api/contact', { ...contact, consent: false })).status, 400);
  assert.equal(sent.length, 0);
  const response = await post('/api/contact', contact);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(sent[0].id, '42');
  assert.ok(sent[0].text.includes(contact.message));
});

test('contact never reports success for disabled delivery or a Telegram failure', async t => {
  const disabled = await fixture(t, { config: { adminChatId: '' } });
  const missing = await disabled.post('/api/contact', contact);
  assert.equal(missing.status, 503);
  assert.equal((await missing.json()).error.code, 'CONTACT_NOT_CONFIGURED');
  const failed = await fixture(t, { failDelivery: true });
  const response = await failed.post('/api/contact', contact);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).error.code, 'CONTACT_DELIVERY_FAILED');
});

test('invalid JSON, wrong content types, oversize bodies and wrong methods fail safely', async t => {
  const { base } = await fixture(t);
  assert.equal((await fetch(base + '/api/chat')).status, 405);
  assert.equal((await fetch(base + '/api/unknown')).status, 404);
  assert.equal((await fetch(base + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
  assert.equal((await fetch(base + '/api/chat', { method: 'POST', body: '{}' })).status, 415);
  const oversized = await fetch(base + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: 'x'.repeat(140000) }) });
  assert.equal(oversized.status, 413);
});

test('static server supports SPA routes and HEAD without exposing dotfiles', async t => {
  const root = await mkdtemp(path.join(tmpdir(), 'autismbridge-static-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(path.join(root, 'index.html'), '<h1>Website</h1>');
  await writeFile(path.join(root, '.env'), 'PRIVATE_SECRET');
  const { base } = await fixture(t, { staticRoot: root });
  assert.equal((await fetch(base + '/ailab')).status, 200);
  const head = await fetch(base + '/', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await fetch(base + '/%2eenv')).status, 404);
  assert.equal((await fetch(base + '/missing.js')).status, 404);
});

test('authenticated Cloudflare forwarding preserves per-client limits and rejects spoofed identity', async t => {
  const { post } = await fixture(t, { config: { webAiPerMinute: 1, proxySharedSecret: 'test-bridge-secret' } });
  const bridge = ip => ({ 'X-Bridge-Proxy-Key': 'test-bridge-secret', 'X-Bridge-Client-IP': ip });
  assert.equal((await post('/api/chat', chat, bridge('192.0.2.10'))).status, 200);
  assert.equal((await post('/api/chat', chat, bridge('192.0.2.11'))).status, 200);
  assert.equal((await post('/api/chat', chat, bridge('192.0.2.10'))).status, 429);
  assert.equal((await post('/api/chat', chat, { 'X-Bridge-Proxy-Key': 'wrong', 'X-Bridge-Client-IP': '192.0.2.12' })).status, 200);
  assert.equal((await post('/api/chat', chat, { 'X-Bridge-Proxy-Key': 'wrong', 'X-Bridge-Client-IP': '192.0.2.13' })).status, 429);
});
