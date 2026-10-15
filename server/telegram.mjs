import { setTimeout as delay } from 'node:timers/promises';
import { LIMITS } from './config.mjs';
import { AppError, publicError } from './errors.mjs';
import { WindowLimiter } from './limits.mjs';
import { trimConversation } from './validation.mjs';

const CONSENT_TEXT = 'سلام، من دستیار آموزشی پل اوتیسم هستم. متن سؤال و بخش اخیر گفتگو برای پردازش به Hugging Face و ارائه‌دهنده مدل ارسال می‌شود. نام کودک، نشانی، پرونده پزشکی یا اطلاعات شناسایی نفرستید. این دستیار تشخیص یا درمان ارائه نمی‌کند و برای شرایط اضطراری مناسب نیست.\n\nبرای اعلام رضایت و شروع گفتگو /agree را بفرستید.\nحریم خصوصی: /privacy\nپاک‌کردن سابقه موقت: /reset\nحذف سابقه و رضایت: /forget\nشناسه شما و این گفتگو: /id';
const PRIVACY_TEXT = 'گفتگوی تلگرام و وب‌سایت مستقل‌اند و همگام‌سازی نمی‌شوند. بخش اخیر گفتگوی ربات فقط در حافظه سرور، حدود ۳۰ دقیقه پس از آخرین فعالیت نگهداری می‌شود و با راه‌اندازی مجدد پاک می‌شود. برای پاسخ‌گویی، متن به Hugging Face و ارائه‌دهنده مدل فرستاده می‌شود؛ خود تلگرام هم پیام‌ها را طبق سیاست‌هایش نگه می‌دارد.\n\n/forget سابقه و رضایت را از حافظه این برنامه پاک می‌کند؛ پیام‌های قبلی را از تلگرام، Hugging Face یا ارائه‌دهنده حذف نمی‌کند. اطلاعات شخصی یا سلامت حساس نفرستید. سیاست Hugging Face: https://huggingface.co/privacy';
const HELP_TEXT = 'سؤال عمومی و بدون اطلاعات شناسایی بنویسید. این ربات آموزشی است، نه ابزار تشخیص یا نسخه پزشکی.\n\n/agree — رضایت و شروع\n/reset — پاک‌کردن گفتگوی موقت\n/forget — حذف گفتگو و رضایت\n/privacy — توضیح حریم خصوصی\n/id — شناسه کاربر و گفتگو\n/help — راهنما';

export class TelegramApiError extends Error {
  constructor(code) {
    super('Telegram API request failed.');
    this.name = 'TelegramApiError';
    this.code = code;
  }
}

export class TelegramApi {
  constructor(token, { fetchImpl = globalThis.fetch } = {}) {
    this.token = token;
    this.fetch = fetchImpl;
  }

  async call(method, payload = {}, { signal, timeoutMs = 12000 } = {}) {
    if (!this.token) throw new TelegramApiError(401);
    const timeout = AbortSignal.timeout(timeoutMs);
    try {
      const response = await this.fetch(`https://api.telegram.org/bot${this.token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      });
      const data = await response.json();
      if (!response.ok || data?.ok !== true) throw new TelegramApiError(data?.error_code || response.status);
      return data.result;
    } catch (error) {
      // Do not expose fetch errors/URLs: Telegram embeds the secret token in the URL.
      if (error instanceof TelegramApiError) throw error;
      if (signal?.aborted) throw new TelegramApiError('CANCELLED');
      throw new TelegramApiError(timeout.aborted ? 'TIMEOUT' : 'NETWORK');
    }
  }

  async sendText(chatId, text, options = {}) {
    for (const chunk of splitTelegramText(text)) {
      await this.call('sendMessage', { chat_id: chatId, text: chunk, link_preview_options: { is_disabled: true } }, options);
    }
  }
}

// At most 3600 UTF-16 units, without splitting an emoji/surrogate pair.
export function splitTelegramText(text) {
  const characters = Array.from(text);
  const chunks = [];
  for (let i = 0; i < characters.length; i += 1800) chunks.push(characters.slice(i, i + 1800).join(''));
  return chunks.length ? chunks : [''];
}

export class TelegramBot {
  constructor({ config, ai, client = new TelegramApi(config.telegramToken), log = console.info, now = Date.now }) {
    this.config = config;
    this.ai = ai;
    this.client = client;
    this.log = log;
    this.now = now;
    this.state = 'disabled';
    this.username = config.telegramUsername;
    this.sessions = new Map();
    this.busy = new Map();
    this.tasks = new Set();
    this.messagesLimiter = new WindowLimiter({ limit: 12, now });
    this.aiLimiter = new WindowLimiter({ limit: 3, now });
    this.controller = new AbortController();
  }

  status() {
    return {
      configured: Boolean(this.config.telegramToken),
      state: this.state,
      username: this.username || null,
      url: this.username ? `https://t.me/${this.username}` : null,
    };
  }

  start() {
    if (!this.config.telegramToken || !this.config.telegramPollingEnabled || this.runPromise) return;
    this.state = 'starting';
    this.cleanupTimer = setInterval(() => this.pruneSessions(), 60000);
    this.cleanupTimer.unref();
    this.runPromise = this.poll();
  }

  async stop() {
    clearInterval(this.cleanupTimer);
    this.controller.abort();
    for (const controller of this.busy.values()) controller.abort();
    await this.runPromise;
    await Promise.allSettled([...this.tasks]);
    this.sessions.clear();
    this.state = 'stopped';
  }

  forget(key) {
    this.busy.get(key)?.abort();
    this.busy.delete(key);
    this.sessions.delete(key);
  }

  pruneSessions() {
    const cutoff = this.now() - LIMITS.sessionMinutes * 60000;
    for (const [key, session] of this.sessions) {
      if (session.updatedAt <= cutoff) this.forget(key);
    }
  }

  async poll() {
    const signal = this.controller.signal;
    let offset = 0;
    let retryMs = 1000;
    let initialized = false;
    while (!signal.aborted) {
      try {
        if (!initialized) {
          const me = await this.client.call('getMe', {}, { signal });
          if (typeof me?.username === 'string' && /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(me.username)) this.username = me.username;
          const webhook = await this.client.call('getWebhookInfo', {}, { signal });
          if (webhook?.url) {
            this.state = 'webhook_conflict';
            this.log('Telegram: an existing webhook was found. Polling stopped; no webhook was changed.');
            return;
          }
          initialized = true;
        }
        this.state = 'connected';
        const updates = await this.client.call('getUpdates', { offset, limit: 20, timeout: 25, allowed_updates: ['message'] }, { signal, timeoutMs: 35000 });
        retryMs = 1000;
        for (const update of Array.isArray(updates) ? updates : []) {
          if (!Number.isSafeInteger(update?.update_id)) continue;
          offset = Math.max(offset, update.update_id + 1);
          if (this.tasks.size >= 64) continue;
          const task = this.handleUpdate(update)
            .catch(() => this.log('Telegram: a message could not be delivered.'))
            .finally(() => this.tasks.delete(task));
          this.tasks.add(task);
        }
      } catch (error) {
        if (signal.aborted) return;
        if (error?.code === 401 || error?.code === 403) {
          this.state = 'error';
          this.log('Telegram: token validation failed. Check TELEGRAM_BOT_TOKEN.');
          return;
        }
        if (error?.code === 409) {
          this.state = 'polling_conflict';
          this.log('Telegram: another poller or webhook is using this bot. Run only one instance.');
          return;
        }
        this.state = 'error';
        this.log('Telegram: connection interrupted; retrying with backoff.');
        await delay(retryMs, undefined, { signal }).catch(() => {});
        retryMs = Math.min(30000, retryMs * 2);
      }
    }
  }

  async handleUpdate(update) {
    const message = update?.message;
    if (message?.chat?.type !== 'private' || !Number.isSafeInteger(message.chat.id) || !Number.isSafeInteger(message.from?.id) || message.from.is_bot) return;
    const userId = String(message.from.id);
    if (this.config.telegramAllowedIds.length && !this.config.telegramAllowedIds.includes(userId)) return;
    if (typeof message.text !== 'string') return;
    const chatId = message.chat.id;
    const key = `${chatId}:${userId}`;
    const text = message.text.trim();
    const command = text.match(/^\/([a-z]+)(?:@[a-z0-9_]+)?(?:\s|$)/i)?.[1]?.toLowerCase();
    const send = value => this.client.sendText(chatId, value, { signal: this.controller.signal });
    this.pruneSessions();

    // Privacy controls remain usable even when the normal message rate limit is reached.
    if (command === 'forget') {
      this.forget(key);
      return send('سابقه موقت و رضایت شما از حافظه این برنامه پاک شد. برای شروع دوباره /agree را بفرستید. این کار پیام‌های تلگرام یا داده‌های پردازش‌شده توسط ارائه‌دهندگان را حذف نمی‌کند.');
    }
    if (command === 'reset') {
      const consented = Boolean(this.sessions.get(key)?.consented);
      this.forget(key);
      if (consented) this.sessions.set(key, { consented: true, messages: [], updatedAt: this.now() });
      return send('گفتگوی موقت پاک شد.' + (consented ? ' می‌توانید سؤال تازه‌ای بنویسید.' : ' برای شروع /agree را بفرستید.'));
    }
    if (!this.messagesLimiter.take(userId).allowed) return;
    if (command === 'start') return send(CONSENT_TEXT);
    if (command === 'privacy') return send(PRIVACY_TEXT);
    if (command === 'help') return send(HELP_TEXT);
    if (command === 'id') return send(`شناسه کاربر شما: ${userId}\nشناسه این گفتگو: ${chatId}\nاین شناسه‌ها توکن ربات نیستند.`);
    if (command === 'agree') {
      if (!this.sessions.has(key)) {
        if (this.sessions.size >= LIMITS.maxSessions) this.forget(this.sessions.keys().next().value);
        this.sessions.set(key, { consented: true, messages: [], updatedAt: this.now() });
      }
      return send('رضایت شما برای پردازش سؤال‌های آموزشی ثبت شد. سؤال خود را بدون نام، پرونده پزشکی یا اطلاعات شناسایی بنویسید. /forget رضایت و سابقه موقت را پاک می‌کند.');
    }
    if (command) return send(HELP_TEXT);
    const session = this.sessions.get(key);
    if (!session?.consented) return send(CONSENT_TEXT);
    if (!text || text.length > LIMITS.maxMessageChars || text.includes('\0')) return send('لطفاً یک پیام متنی با حداکثر ۴۰۰۰ نویسه بنویسید.');
    if (this.busy.has(key)) return send('هنوز در حال پاسخ به سؤال قبلی هستم. برای توقف و پاک‌کردن گفتگو /reset را بفرستید.');
    if (!this.aiLimiter.take(userId).allowed) return send('لطفاً بین سؤال‌ها کمی فاصله بگذارید؛ حداکثر سه سؤال در دقیقه پذیرفته می‌شود.');
    const requestController = new AbortController();
    this.busy.set(key, requestController);
    session.updatedAt = this.now();
    try {
      await this.client.call('sendChatAction', { chat_id: chatId, action: 'typing' }, { signal: this.controller.signal }).catch(() => {});
      const history = trimConversation([...session.messages, { role: 'user', content: text }]);
      const response = await this.ai.chat(history, { signal: AbortSignal.any([requestController.signal, this.controller.signal]) });
      if (requestController.signal.aborted || this.controller.signal.aborted || this.sessions.get(key) !== session) return;
      const suffix = response.truncated ? '\n\n[پاسخ به سقف طول رسید؛ برای جزئیات بیشتر سؤال کوتاه‌تری بپرسید.]' : '';
      await this.client.sendText(chatId, response.text + suffix + '\n\n—\nراهنمای آموزشی؛ نه تشخیص یا نسخه پزشکی.', {
        signal: AbortSignal.any([requestController.signal, this.controller.signal]),
      });
      if (requestController.signal.aborted || this.controller.signal.aborted || this.sessions.get(key) !== session) return;
      session.messages = trimConversation([...history, { role: 'assistant', content: response.text }]);
      session.updatedAt = this.now();
    } catch (error) {
      if (!requestController.signal.aborted && !this.controller.signal.aborted) {
        const safe = error instanceof AppError ? error : publicError(error);
        await send(safe.message);
      }
    } finally {
      if (this.busy.get(key) === requestController) this.busy.delete(key);
    }
  }
}
