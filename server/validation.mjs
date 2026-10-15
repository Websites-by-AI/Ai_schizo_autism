import { LIMITS } from './config.mjs';
import { AppError } from './errors.mjs';

const invalid = message => new AppError(400, 'INVALID_INPUT', message);

export function validateMessages(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > LIMITS.maxMessages) {
    throw invalid('تعداد پیام‌های گفتگو معتبر نیست. یک گفتگوی تازه شروع کنید.');
  }
  let total = 0;
  const messages = value.map((message, index) => {
    const expectedRole = index % 2 === 0 ? 'user' : 'assistant';
    if (!message || typeof message !== 'object' || message.role !== expectedRole || typeof message.content !== 'string') {
      throw invalid('ساختار پیام گفتگو معتبر نیست.');
    }
    const content = message.content.trim();
    if (!content || content.length > LIMITS.maxMessageChars || content.includes('\0')) {
      throw invalid(`هر پیام باید بین ۱ تا ${LIMITS.maxMessageChars} نویسه باشد.`);
    }
    total += content.length;
    return { role: expectedRole, content };
  });
  if (messages.at(-1).role !== 'user' || total > LIMITS.maxTotalChars) {
    throw invalid('گفتگو بیش از حد طولانی است؛ لطفاً گفتگوی تازه‌ای شروع کنید.');
  }
  return messages;
}

// Keep complete user/assistant pairs; never accept a caller-supplied system role.
export function trimConversation(messages) {
  let result = messages.slice(-LIMITS.maxMessages);
  if (result[0]?.role === 'assistant') result = result.slice(1);
  while (result.length > 1 && result.reduce((sum, message) => sum + message.content.length, 0) > LIMITS.maxTotalChars) {
    result = result.slice(2);
  }
  return result;
}

export function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw invalid('فرم پیام معتبر نیست.');
  if (body.website) throw invalid('ارسال فرم پذیرفته نشد.');
  const fields = { name: [2, 80], contact: [5, 150], topic: [2, 80], message: [10, 2000] };
  const result = {};
  for (const [key, [min, max]] of Object.entries(fields)) {
    const value = body[key];
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max || value.includes('\0')) {
      throw invalid('لطفاً نام، راه تماس، موضوع و متن پیام را با طول مجاز وارد کنید.');
    }
    result[key] = value.trim();
  }
  return result;
}
