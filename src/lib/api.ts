export type ChatMessage = { role: "user" | "assistant"; content: string };

export type IntegrationStatus = {
  ai: { configured: boolean; model: string };
  telegram: {
    configured: boolean;
    state: "disabled" | "starting" | "connected" | "error" | "webhook_conflict" | "polling_conflict" | "stopped";
    username: string | null;
    url: string | null;
  };
  contact: { enabled: boolean };
  webAccessRequired: boolean;
  limits: { maxMessages: number; maxMessageChars: number; maxTotalChars: number; sessionMinutes: number };
};

export class ApiError extends Error {
  code: string;
  constructor(message: string, code = "REQUEST_FAILED") {
    super(message);
    this.code = code;
  }
}

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const response = await fetch(base + url, { ...options, headers: { "Content-Type": "application/json", ...options?.headers } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.error?.message || "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.", data?.error?.code);
  if (!data) throw new ApiError("پاسخ سرور معتبر نبود.");
  return data as T;
}

export function recentConversation(messages: ChatMessage[]): ChatMessage[] {
  let result = messages.slice(-11);
  if (result[0]?.role === "assistant") result = result.slice(1);
  while (result.length > 1 && result.reduce((sum, item) => sum + item.content.length, 0) > 24000) result = result.slice(2);
  return result.map(({ role, content }) => ({ role, content }));
}

export function telegramStateLabel(status: IntegrationStatus["telegram"] | undefined): string {
  if (!status?.configured) return "نیاز به تنظیم توکن";
  switch (status.state) {
    case "connected": return "ربات در حال اجرا";
    case "starting": return "در حال اتصال";
    case "webhook_conflict": return "وبهوک قبلی فعال است";
    case "polling_conflict": return "اجرای هم‌زمان ربات";
    case "error": return "اتصال نیاز به بررسی دارد";
    default: return "پاسخ‌گویی ربات غیرفعال است";
  }
}
