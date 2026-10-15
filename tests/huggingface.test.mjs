import test from 'node:test';
import assert from 'node:assert/strict';
import { getConfig } from '../server/config.mjs';
import { createHuggingFace, SYSTEM_PROMPT } from '../server/huggingface.mjs';

const config = overrides => ({ ...getConfig({ HF_TOKEN: 'hf_PRIVATE_TEST_ONLY' }), ...overrides });
const messages = [{ role: 'user', content: 'یک سؤال آموزشی' }];
const reply = () => Response.json({ choices: [{ message: { content: 'یک پاسخ آموزشی' }, finish_reason: 'stop' }] });

test('HF sends the configured model and server-owned system prompt with a private bearer token', async () => {
  const calls = [];
  const ai = createHuggingFace(config({}), { fetchImpl: async (url, options) => { calls.push({ url, options }); return reply(); } });
  const result = await ai.chat(messages);
  assert.equal(result.text, 'یک پاسخ آموزشی');
  assert.equal(calls[0].url, 'https://router.huggingface.co/v1/chat/completions');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer hf_PRIVATE_TEST_ONLY');
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.messages[0].role, 'system');
  assert.equal(body.messages[0].content, SYSTEM_PROMPT);
  assert.ok(SYSTEM_PROMPT.includes('NEVER diagnose'));
  assert.equal(body.messages[1].content, messages[0].content);
  assert.equal(body.stream, false);
  assert.equal(result.truncated, false);
});

test('missing HF secret fails closed without making a request', async () => {
  let called = false;
  const ai = createHuggingFace(config({ hfToken: '' }), { fetchImpl: async () => { called = true; return reply(); } });
  await assert.rejects(ai.chat(messages), { code: 'HF_NOT_CONFIGURED', status: 503 });
  assert.equal(called, false);
});

test('provider errors are mapped without leaking tokens or response bodies', async () => {
  for (const [status, code] of [[401, 'HF_AUTH_ERROR'], [403, 'HF_AUTH_ERROR'], [402, 'HF_CREDITS_REQUIRED'], [404, 'HF_MODEL_UNAVAILABLE'], [429, 'HF_RATE_LIMITED'], [500, 'HF_UNAVAILABLE']]) {
    const ai = createHuggingFace(config({}), { fetchImpl: async () => new Response('hf_PRIVATE_TEST_ONLY provider-private-detail', { status }) });
    await assert.rejects(ai.chat(messages), error => error.code === code && !error.message.includes('PRIVATE') && !error.message.includes('provider-private-detail'));
  }
});

test('empty provider responses and timeouts are reported honestly', async () => {
  const empty = createHuggingFace(config({}), { fetchImpl: async () => Response.json({ choices: [] }) });
  await assert.rejects(empty.chat(messages), { code: 'HF_INVALID_RESPONSE' });
  const slow = createHuggingFace(config({ hfTimeoutMs: 5 }), { fetchImpl: async (_url, options) => {
    await new Promise(resolve => setTimeout(resolve, 20));
    options.signal.throwIfAborted();
    return reply();
  } });
  await assert.rejects(slow.chat(messages), { code: 'HF_TIMEOUT' });
});

test('cancelled requests do not start inference', async () => {
  const controller = new AbortController();
  controller.abort();
  const ai = createHuggingFace(config({}), { fetchImpl: async () => { throw new Error('must not be reached'); } });
  await assert.rejects(ai.chat(messages, { signal: controller.signal }), { code: 'CANCELLED' });
});

test('AI concurrency and shared global request budget are bounded', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const ai = createHuggingFace(config({ maxConcurrentAi: 1 }), { fetchImpl: async () => { await gate; return reply(); } });
  const first = ai.chat(messages);
  await assert.rejects(ai.chat(messages), { code: 'AI_BUSY' });
  release();
  await first;
  const limited = createHuggingFace(config({ globalAiPerMinute: 1 }), { fetchImpl: async () => reply() });
  await limited.chat(messages);
  await assert.rejects(limited.chat(messages), { code: 'RATE_LIMITED' });
});

test('long output is capped and labelled truncated', async () => {
  const ai = createHuggingFace(config({}), { fetchImpl: async () => Response.json({ choices: [{ message: { content: 'x'.repeat(5000) }, finish_reason: 'length' }] }) });
  const result = await ai.chat(messages);
  assert.equal(result.text.length, 4000);
  assert.equal(result.truncated, true);
});
