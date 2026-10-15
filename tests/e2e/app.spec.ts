import { test, expect } from "@playwright/test";

const configuredStatus = {
  ai: { configured: true, model: "Qwen/test-model" },
  telegram: { configured: true, state: "connected", username: "Example_test_bot", url: "https://t.me/Example_test_bot" },
  contact: { enabled: true }, webAccessRequired: false,
  limits: { maxMessages: 11, maxMessageChars: 4000, maxTotalChars: 24000, sessionMinutes: 30 },
};

test("unconfigured deployment never pretends to be connected", async ({ page }) => {
  await page.goto("/#ailab");
  await expect(page.getByRole("heading", { name: "سؤال‌های کوچک،" })).toBeVisible();
  await expect(page.getByText("نیاز به تنظیم HF_TOKEN", { exact: false })).toBeVisible();
  await page.locator("#assistant-prompt").fill("سؤال آموزشی عمومی");
  await page.getByRole("checkbox").check();
  await expect(page.getByRole("button", { name: "ارسال سؤال", exact: true })).toBeDisabled();
  await expect(page.getByText("هیچ پاسخ ساختگی", { exact: false })).toBeVisible();
});

test("consented chat sends to API and renders model text without executing HTML", async ({ page }) => {
  await page.route("**/api/status", route => route.fulfill({ json: configuredStatus }));
  const sent: Array<Record<string, unknown>> = [];
  await page.route("**/api/chat", async route => {
    sent.push(route.request().postDataJSON());
    await route.fulfill({ json: { text: "پاسخ آزمایشی <script>window.UNSAFE=true</script>", truncated: false, model: "Qwen/test-model" } });
  });
  await page.goto("/#ailab");
  await page.locator("#assistant-prompt").fill("سؤال آموزشی من");
  await expect(page.getByRole("button", { name: "ارسال سؤال", exact: true })).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "ارسال سؤال", exact: true }).click();
  await expect(page.getByRole("log")).toContainText("پاسخ آزمایشی <script>");
  expect(sent[0].consent).toBe(true);
  expect(await page.evaluate(() => "UNSAFE" in window)).toBe(false);
  await page.getByRole("button", { name: "پاک کردن گفتگو", exact: true }).click();
  await expect(page.getByRole("heading", { name: "از کجا شروع کنیم؟" })).toBeVisible();
});

test("provider error is displayed without a fake assistant answer", async ({ page }) => {
  await page.route("**/api/status", route => route.fulfill({ json: configuredStatus }));
  await page.route("**/api/chat", route => route.fulfill({ status: 503, json: { error: { code: "HF_AUTH_ERROR", message: "توکن آزمایشی تأیید نشد" } } }));
  await page.goto("/#ailab");
  await page.getByRole("checkbox").check();
  await page.locator("#assistant-prompt").fill("سؤال تست");
  await page.getByRole("button", { name: "ارسال سؤال", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText(/توکن آزمایشی تأیید نشد/);
  await expect(page.getByRole("log")).toContainText("پاسخ دریافت نشد");
  await expect(page.getByRole("log")).not.toContainText("دستیار آموزشی");
});

test("contact success requires the API acknowledgement", async ({ page }) => {
  await page.route("**/api/status", route => route.fulfill({ json: configuredStatus }));
  await page.route("**/api/contact", route => route.fulfill({ json: { ok: true } }));
  await page.goto("/#contact");
  await page.locator("#contact-name").fill("نام مستعار");
  await page.locator("#contact-address").fill("test@example.invalid");
  await page.locator("#contact-message").fill("یک سؤال عمومی برای مدیر سایت.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "ارسال به مدیر سایت", exact: true }).click();
  await expect(page.getByRole("heading", { name: "پیام به تلگرام مدیر رسید" })).toBeVisible();
});

test("mobile assistant fits the viewport and deep links survive reload", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#ailab");
  await page.reload();
  await expect(page.locator("#assistant-prompt")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
