import test from 'node:test';
import assert from 'node:assert/strict';
import { getConfig } from '../server/config.mjs';
import { TelegramApi, TelegramApiError, TelegramBot, splitTelegramText } from '../server/telegram.mjs';

const update = (text, extra = {}) => ({ update_id: 1, message: { chat: { id: 42, type: 'private' }, from: { id: 42, is_bot: false }, text, ...extra } });
function fixture(options = {}) {
  const sent = [];
  const requests = [];
  const config = { ...getConfig({ TELEGRAM_BOT_TOKEN: 'PRIVATE_TELEGRAM_TEST_TOKEN' }), ...options.config };
  const client = { call: async () => ({}), sendText: async (id, text) => { sent.push({ id, text }); }, ...options.client };
  const ai = { chat: async (messages, opts) => { requests.push({ messages, opts }); return { text: 'پاسخ آموزشی', truncated: false }; }, ...options.ai };
  const bot = new TelegramBot({ config, client, ai, log: () => {}, ...(options.now ? { now: options.now } : {}) });
  return { bot, sent, requests };
}

test('Telegram requires explicit consent before contacting AI and isolates users', async () => {
  const { bot, sent, requests } = fixture();
  await bot.handleUpdate(update('hello'));
  assert.equal(requests.length, 0);
  assert.ok(sent.at(-1).text.includes('/agree'));
  await bot.handleUpdate(update('/agree'));
  await bot.handleUpdate(update('سؤال اول'));
  await bot.handleUpdate(update('سؤال دوم'));
  assert.equal(requests.length, 2);
  assert.equal(requests[1].messages.length, 3);
  assert.ok(sent.at(-1).text.includes('نه تشخیص'));
  await bot.handleUpdate(update('other user', { chat: { id: 43, type: 'private' }, from: { id: 43 } }));
  assert.equal(requests.length, 2);
});

test('groups, bot messages and users outside the allowlist are ignored', async () => {
  const { bot, sent } = fixture({ config: { telegramAllowedIds: ['42'] } });
  await bot.handleUpdate(update('/agree', { chat: { id: -100, type: 'group' } }));
  await bot.handleUpdate(update('/agree', { from: { id: 99 } }));
  await bot.handleUpdate(update('/agree', { from: { id: 42, is_bot: true } }));
  assert.equal(sent.length, 0);
});

test('/reset clears history and /forget also removes consent', async () => {
  const { bot, requests } = fixture();
  await bot.handleUpdate(update('/agree'));
  await bot.handleUpdate(update('first'));
  await bot.handleUpdate(update('/reset'));
  await bot.handleUpdate(update('second'));
  assert.equal(requests.at(-1).messages.length, 1);
  await bot.handleUpdate(update('/forget'));
  assert.equal(bot.sessions.size, 0);
  await bot.handleUpdate(update('third'));
  assert.equal(requests.length, 2);
});

test('/forget cancels in-flight inference and prevents a late answer from restoring history', async () => {
  let finish;
  let signal;
  const { bot, sent } = fixture({ ai: { chat: async (_messages, options) => { signal = options.signal; await new Promise(resolve => { finish = resolve; }); return { text: 'LATE_PRIVATE_ANSWER' }; } } });
  await bot.handleUpdate(update('/agree'));
  const pending = bot.handleUpdate(update('question'));
  await new Promise(resolve => setImmediate(resolve));
  await bot.handleUpdate(update('/forget'));
  assert.equal(signal.aborted, true);
  finish();
  await pending;
  assert.equal(bot.sessions.size, 0);
  assert.equal(sent.some(item => item.text.includes('LATE_PRIVATE_ANSWER')), false);
});

test('session consent/history expire after 30 minutes of inactivity', async () => {
  let now = 0;
  const { bot, requests } = fixture({ now: () => now });
  await bot.handleUpdate(update('/agree'));
  now = 30 * 60000 + 1;
  await bot.handleUpdate(update('expired question'));
  assert.equal(bot.sessions.size, 0);
  assert.equal(requests.length, 0);
});

test('existing webhooks are detected but never deleted or replaced', async () => {
  const methods = [];
  const { bot } = fixture({ client: { call: async method => { methods.push(method); return method === 'getMe' ? { username: 'Example_test_bot' } : { url: 'https://existing.example.invalid/webhook' }; } } });
  bot.start();
  await bot.runPromise;
  assert.equal(bot.status().state, 'webhook_conflict');
  assert.deepEqual(methods, ['getMe', 'getWebhookInfo']);
  await bot.stop();
});

test('competing pollers stop with an honest conflict state', async () => {
  const { bot } = fixture({ client: { call: async method => {
    if (method === 'getMe') return { username: 'Example_test_bot' };
    if (method === 'getWebhookInfo') return { url: '' };
    throw new TelegramApiError(409);
  } } });
  bot.start();
  await bot.runPromise;
  assert.equal(bot.state, 'polling_conflict');
  await bot.stop();
});

test('Telegram transport errors do not expose token-bearing URLs', async () => {
  const api = new TelegramApi('DO_NOT_LEAK_TOKEN', { fetchImpl: async () => { throw new Error('https://api.telegram.org/botDO_NOT_LEAK_TOKEN/sendMessage'); } });
  await assert.rejects(api.sendText(42, 'text'), error => !String(error).includes('DO_NOT_LEAK_TOKEN') && error.code === 'NETWORK');
});

test('long Telegram output is split without breaking Unicode or enabling markup', async () => {
  const text = '😀'.repeat(5000);
  const chunks = splitTelegramText(text);
  assert.equal(chunks.join(''), text);
  assert.ok(chunks.every(chunk => chunk.length <= 4096));
  const payloads = [];
  const api = new TelegramApi('test', { fetchImpl: async (_url, options) => { payloads.push(JSON.parse(options.body)); return Response.json({ ok: true, result: {} }); } });
  await api.sendText(42, '<b>untrusted text</b>');
  assert.equal(payloads[0].parse_mode, undefined);
  assert.equal(payloads[0].text, '<b>untrusted text</b>');
});
