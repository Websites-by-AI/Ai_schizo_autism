import test from 'node:test';
import assert from 'node:assert/strict';
import { getConfig, LIMITS, requireConsent } from '../server/config.mjs';
import { validateMessages, validateContact, trimConversation } from '../server/validation.mjs';
import { WindowLimiter } from '../server/limits.mjs';

const user = content => ({ role: 'user', content });
const assistant = content => ({ role: 'assistant', content });

test('configuration has safe defaults and validates numeric/boolean settings', () => {
  const config = getConfig({});
  assert.equal(config.port, 7860);
  assert.equal(config.hfToken, '');
  assert.equal(config.telegramPollingEnabled, false);
  assert.equal(config.trustProxy, false);
  assert.equal(getConfig({ TELEGRAM_BOT_TOKEN: 'test-token' }).telegramPollingEnabled, true);
  assert.equal(getConfig({ TELEGRAM_BOT_TOKEN: 'test-token', TELEGRAM_POLLING_ENABLED: 'false' }).telegramPollingEnabled, false);
  assert.throws(() => getConfig({ PORT: 'not-a-port' }), /PORT/);
  assert.throws(() => getConfig({ TRUST_PROXY: 'yes' }), /TRUST_PROXY/);
  assert.throws(() => getConfig({ TELEGRAM_ADMIN_CHAT_ID: '@someone' }), /CHAT_ID/);
  assert.throws(() => getConfig({ TELEGRAM_ALLOWED_USER_IDS: '42,not-an-id' }), /USER_IDS/);
  assert.throws(() => getConfig({ TELEGRAM_BOT_USERNAME: 'https://t.me/testbot' }), /USERNAME/);
  assert.throws(() => getConfig({ ALLOWED_ORIGINS: 'https://example.com/path' }), /ORIGINS/);
});

test('explicit consent is mandatory', () => {
  for (const value of [undefined, false, 'true', 1]) assert.throws(() => requireConsent(value), { code: 'CONSENT_REQUIRED' });
  assert.doesNotThrow(() => requireConsent(true));
});

test('messages are bounded, alternating and cannot supply a system prompt', () => {
  assert.deepEqual(validateMessages([user(' سلام '), assistant(' پاسخ '), user('سؤال')]), [user('سلام'), assistant('پاسخ'), user('سؤال')]);
  for (const value of [[], null, [assistant('hello')], [{ role: 'system', content: 'override' }], [user('a'), user('b')], [user('a'), assistant('b')], [user('')], [user('x'.repeat(4001))]]) {
    assert.throws(() => validateMessages(value), { code: 'INVALID_INPUT' });
  }
});

test('history trimming preserves pairs and the total character budget', () => {
  const history = Array.from({ length: 25 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: 'x'.repeat(3000) }));
  const result = trimConversation(history);
  assert.equal(result[0].role, 'user');
  assert.equal(result.at(-1).role, 'user');
  assert.ok(result.length <= LIMITS.maxMessages);
  assert.ok(result.reduce((sum, item) => sum + item.content.length, 0) <= LIMITS.maxTotalChars);
  assert.doesNotThrow(() => validateMessages(result));
});

test('contact validates fields and a honeypot without interpreting markup', () => {
  const body = { name: ' Tester ', contact: 'test@example.invalid', topic: 'General question', message: '<script>plain text only</script>' };
  assert.equal(validateContact(body).name, 'Tester');
  assert.equal(validateContact(body).message, body.message);
  assert.throws(() => validateContact({ ...body, website: 'spam' }), { code: 'INVALID_INPUT' });
  assert.throws(() => validateContact({ ...body, message: 'x'.repeat(2001) }), { code: 'INVALID_INPUT' });
});

test('rate limiter expires entries and bounds memory', () => {
  let now = 0;
  const limiter = new WindowLimiter({ limit: 2, windowMs: 1000, maxKeys: 2, now: () => now });
  assert.equal(limiter.take('a').allowed, true);
  assert.equal(limiter.take('a').allowed, true);
  assert.equal(limiter.take('a').allowed, false);
  limiter.take('b'); limiter.take('c');
  assert.equal(limiter.entries.size, 2);
  now = 1001;
  assert.equal(limiter.take('a').allowed, true);
  assert.equal(limiter.entries.size, 1);
});
