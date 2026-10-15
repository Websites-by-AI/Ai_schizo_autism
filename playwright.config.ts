import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:7861",
    browserName: "chromium",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:7861/api/health",
    env: { PORT: "7861", HF_TOKEN: "", TELEGRAM_BOT_TOKEN: "", WEB_ACCESS_TOKEN: "" },
    reuseExistingServer: false,
  },
});
