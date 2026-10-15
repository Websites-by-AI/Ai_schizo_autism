---
title: AutismBridge AI and Telegram
emoji: 🌿
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
license: gpl-3.0
---

# AutismBridge · Hugging Face + Telegram

Updated from [Websites-by-AI/Ai_schizo_autism](https://github.com/Websites-by-AI/Ai_schizo_autism), base commit `8243e4bacc7b7e0cf6da273a4cc6ff79362eef68`.

**What changed:** a refreshed Persian/RTL educational assistant, a native Cloudflare API for Hugging Face inference, a static Hugging Face Space, optional consented Telegram contact alerts, and an optional Node/Docker backend with a Telegram AI polling bot.

**Credentials are never included in source.** The app deliberately shows “not configured” instead of fake replies when secrets are missing. Account credentials are configured only through hosting Secrets; see `DEPLOYMENT.md` for the deployment record when available.

> Educational use only. The former AI Lab's formula-generated severity, support-level, treatment-match and growth-prediction charts have been removed. A general-purpose language model is not a validated diagnostic or screening tool.

## 1. Optional Node hosting: Hugging Face Docker Spaces

1. Create a [new Space](https://huggingface.co/new-space), choose **Docker → Blank**. CPU is sufficient because inference happens through the hosted API. **The account API required a PRO subscription for Docker/Gradio cpu-basic hosting during this deployment; no subscription was purchased.** Use the static Space + Cloudflare option below when Docker hosting is unavailable.
2. Upload this project's files to the Space repository, including `Dockerfile`, `README.md`, `package.json`, `package-lock.json`, `src/`, `server/`, `index.html`, `tsconfig.json`, and `vite.config.ts`. Uploading all source files from the ZIP is fine. **Do not upload `.env`, tokens, `node_modules`, `.git`, or local build output.**
3. Open **Space Settings → Variables and secrets**. Add:

| Name | Kind | What to enter |
| --- | --- | --- |
| `HF_TOKEN` | Secret | Your fine-grained Hugging Face token with permission to make **Inference Providers** calls |
| `TELEGRAM_BOT_TOKEN` | Secret | Your bot token from **@BotFather** in Telegram |
| `HF_MODEL` | Variable, optional | `Qwen/Qwen3-235B-A22B-Instruct-2507`, or another supported chat model |
| `TELEGRAM_BOT_USERNAME` | Variable, optional | Your bot's username without `@`; normally discovered automatically |
| `WEB_ACCESS_TOKEN` | Secret, recommended for private testing | A new shared website access key, **not** an API token |

4. Wait for the build and runtime startup. Open the app and choose **دستیار هوش مصنوعی** or append `/#ailab` to the direct app URL.
5. In your Telegram bot, send `/start`, read the privacy notice, then send `/agree`. Ask a general, non-identifying question.
6. Optional contact notifications: send `/id` to your bot. Copy **the chat ID** into a Space Secret named `TELEGRAM_ADMIN_CHAT_ID`. The contact form then sends consented enquiries to that chat.

### Important hosting notes

- The app listens on `0.0.0.0:7860`. One server serves the frontend and `/api`; no browser-facing `localhost` API URLs are used.
- **Run only one polling instance per bot token.** Don't run local development with the same bot token while your Space is running. Set `TELEGRAM_POLLING_ENABLED=false` in the second instance if it only needs notification sending.
- The worker checks for an existing webhook and **stops without changing it**. If your bot is already in use elsewhere, choose a different bot or intentionally remove the old webhook using Telegram's official tools before switching. No webhook is removed automatically.
- If your host sleeps, restarts or is unavailable, your bot is unavailable too. For reliable continuous service, choose an always-running hosting option.
- Hugging Face Inference Providers may require credits/payment. Model and provider availability can change. Check [the Playground](https://huggingface.co/playground), permissions and your spending limits.
- `HF_TOKEN` present means **configured**, not “credentials verified.” Only a successful inference request confirms the model path is working.

## 2. Run locally

Use Node.js **20.19+** (Node 22 recommended).

```bash
npm ci
cp .env.example .env
# Edit .env privately; leave secrets blank if you only want to inspect the UI.
npm run dev
```

Open `http://localhost:7860/#ailab`. Development includes Vite and the backend in the same process.

Production without Docker:

```bash
npm run build
npm start
```

Optional Docker run after installing Docker:

```bash
docker build -t autismbridge .
docker run --rm --env-file .env -p 7860:7860 autismbridge
```

Never put credentials in a `VITE_` variable, React code, screenshots, Git history or a public Space Variable. Inference and Telegram tokens belong only in server `.env` files or hosting **Secrets**.

## Deployed option: Cloudflare API + static Hugging Face Space

This avoids the Docker hosting subscription requirement. The same static website is published on Pages and a static Space. Cloudflare's server-side API calls Hugging Face Inference Providers. **Inference still requires available Hugging Face credits; hosting the static website does not provide model credits.**

1. Create a **static** Hugging Face Space. Its README should use `sdk: static` and `app_file: site/index.html`; the template is `huggingface/README.md`. The Space needs no provider token or backend runtime.
2. Create a new direct-upload Cloudflare Pages project. Set `HF_TOKEN` as an encrypted/secret production environment variable, with permission to make Inference Providers calls. Do not set `HF_SPACE_URL` in native mode.
3. Set public Pages variables `HF_MODEL` and `ALLOWED_ORIGINS`. The latter must include the actual `https://...hf.space` app origin to permit its browser API calls. CORS is restricted to that origin and the Pages API's own origin.
4. Build with the Pages URL as the **public**, non-secret API base:

```bash
VITE_API_BASE_URL=https://YOUR_PROJECT.pages.dev npm run build:cloudflare
# Authenticate Wrangler through its supported login/token mechanism.
# Never paste credential values into commands, source or Git history.
npx --yes wrangler@4.45.0 pages deploy dist --project-name YOUR_PROJECT --branch main
```

5. Upload the built `dist/index.html` to the Space as `site/index.html`, and use `huggingface/README.md` for its root README. Other project source can remain alongside it. Never upload a real `.env`, credentials or local dependencies.

The advanced Pages Worker handles only `/api/*`; static assets do not invoke it. In native mode it reuses the Node backend's validation, educational system prompt, inference client, error handling and in-memory limiter. It also supports consented contact notifications when the admin privately sets `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID`. **It does not run the Node Telegram polling worker.** Telegram AI chat still needs a continuously running Node host or a separately implemented durable webhook service; no bot is activated by this deployment.

Edge limits are per Worker isolate and are not a distributed budget guarantee. Add strong access controls and provider-side spending caps before exposing funded inference broadly. An optional `WEB_ACCESS_TOKEN` is supported by both runtimes.

### Optional proxy mode

If a Node/Docker Space is available, set Pages `HF_SPACE_URL` to its HTTPS `*.hf.space` app URL and set the same random `PROXY_SHARED_SECRET` in Pages and the Space. Requests are then proxied instead of handled natively; the secret authenticates client-IP forwarding and is unrelated to any provider token. This proxy rejects cross-origin calls, untrusted upstreams, oversize bodies and redirects. In this mode, use a same-origin website build rather than cross-origin static-Space API calls.

The repository's CI checks code; it does not automatically deploy on merge. To update the deployed sites, rebuild/publish Pages and upload the corresponding static bundle to the Space. See `DEPLOYMENT.md` for live URLs, verification and remaining activation steps.

## 3. Features and controls

### Website

- Persian/RTL chat with starter questions, recent conversation context, cancellation, plain-text export and reset.
- Explicit third-party processing consent before sending a question.
- Optional `WEB_ACCESS_TOKEN`: visitors enter a dedicated shared key in the UI. This is a basic access gate, not a full multi-user authentication system. The browser must never receive your `HF_TOKEN` or Telegram token.
- Real connection/configuration indicators and actionable missing-token, model, credit, timeout and delivery errors. No simulated model responses.
- Real contact-form delivery to the configured Telegram admin only after explicit consent. Success appears only after the Telegram API acknowledges the send; no reply-time promise is made.
- Hash routes, browser back/forward, direct assistant/contact links, keyboard focus styling and reduced-motion support.

### Telegram commands (Node hosting only)

| Command | Behavior |
| --- | --- |
| `/start` | Welcome and privacy/consent instructions |
| `/agree` | Consent to process general questions with Hugging Face and its provider |
| `/help` | Show commands |
| `/privacy` | Explain retention and third-party processing |
| `/reset` | Cancel an in-flight question and clear app-side history, keeping current consent |
| `/forget` | Cancel, clear app-side history **and** remove current consent |
| `/id` | Show your numeric user and private-chat IDs for configuration |

Only private text messages are handled; group chats, files, voice messages and messages from other bots are ignored. Set `TELEGRAM_ALLOWED_USER_IDS` to a comma-separated list of user IDs for private testing. Empty means the bot is public. This allowlist does not restrict which admin chat receives configured notifications.

### Limits

Defaults are 4 concurrent inference calls, 30 combined website/bot requests per minute globally, 8 website questions per IP per minute, 3 Telegram questions per user per minute, and 3 contact submissions per IP per hour with a global 20/hour contact cap. Messages are limited to 4,000 UTF-16 code units; model history is capped at 11 messages and 24,000 code units. Adjust supported settings in `.env.example`.

Rate limits, sessions and consent are **in-memory**, single-instance controls. They reset when the process restarts. Use a shared store, stronger authentication and infrastructure-level abuse/budget controls before scaling or exposing paid inference broadly. App rate limits alone are not a spending guarantee.

For the optional Node backend, `TRUST_PROXY=false` by default: spoofed `X-Forwarded-For` values are ignored. Enable it **only** behind a trusted reverse proxy that sets that header; the app then trusts its last/rightmost address (one hop). Check your proxy's behavior. A shared proxy address can otherwise cause visitors to share a rate-limit bucket.

## 4. Privacy and safety boundaries

- Website conversation text and its optional access key are held in React memory, not local storage or a program database. Leaving the assistant page or reloading clears its history. Each inference request carries only the recent conversation window.
- Telegram holds a bounded recent history and consent per private chat/user in RAM. Sessions expire after 30 idle minutes; cleanup runs at one-minute intervals and before each message. All sessions are removed at restart. Web and Telegram histories are **not synchronized**.
- `/forget` and website reset delete local app history, **not** messages already stored by Telegram, Hugging Face, the inference provider, the admin recipient, host infrastructure, or a downloaded export.
- Inference text is transmitted to Hugging Face and its selected provider. Contact enquiries go to Telegram/the configured admin, not to the AI model. Hosting infrastructure can independently retain request metadata; review its settings.
- Cloudflare processes the deployed website API requests before forwarding inference text to Hugging Face. Application logs do not intentionally record prompts, contact fields, bot-token URLs or credential values. Public status never includes secrets or the admin chat ID.
- Model output is rendered as text, not HTML; Telegram uses no `parse_mode`. The server owns the system prompt, rejects client system roles, bounds inputs and handles timeouts/cancellation.
- The system prompt instructs the model not to diagnose, prescribe medication, infer support levels, predict growth or fabricate up-to-date research/legal advice. **A prompt is not a clinical safety guarantee.** Obtain appropriate expert, privacy and security review before public release. This is not a clinical device, crisis service or clinical record system.
- Other original repository content (events, profiles, statistics, articles, maps, legal guidance and any remaining checklists) has largely been preserved and has **not** been fact-checked or clinically validated by this integration. Treat it as demonstration/editorial content until independently reviewed. No services, staff qualifications or clinic listings are verified by this change.

Policies: [Hugging Face](https://huggingface.co/privacy) · [Telegram](https://telegram.org/privacy). Review the selected inference provider's policy too.

## 5. Tests

```bash
npm run check                   # TypeScript, Node tests, production frontend build
npx playwright install --with-deps chromium
npm run test:e2e                 # Browser tests; external AI/bot calls mocked
```

The test suite covers input/consent validation, server-owned prompting, credential redaction, provider errors, timeout/concurrency limits, session isolation and deletion, existing webhook protection, optional website access keys, request size/origin checks, static file protection, mobile layout and real-vs-failed form behavior.

**Automated verification:** TypeScript, backend/unit/Cloudflare proxy tests, Chromium browser tests and the production frontend build. Automated tests mock external services; real deployment and smoke-test results are recorded separately in `DEPLOYMENT.md`. A Telegram bot cannot run until its token is configured.

## 6. Project layout

```text
src/pages/AiLab.tsx                 Educational website chat
src/pages/Contact.tsx               Consented enquiries to Telegram admin
src/components/IntegrationsProvider.tsx  Public integration status
src/lib/api.ts                     Same-origin browser API helpers
server/index.mjs                   Node entry point + optional Vite development
server/http.mjs                    API, validation, rate limits, static hosting
server/huggingface.mjs              Inference Router client + educational prompt
server/telegram.mjs                 Private-chat bot + Telegram API client
server/config.mjs                  Server environment + limits
server/validation.mjs               Bounded input/history validation
cloudflare/_worker.js               Same-origin Pages API proxy to the Space
cloudflare/api.mjs                 Native edge API with restricted static-Space CORS
scripts/prepare-cloudflare.mjs      Bundle the Pages Worker after the Vite build
huggingface/README.md               Static Space metadata/template
tests/                             Node tests and browser tests
Dockerfile                         Non-root Spaces container, runtime secrets only
.env.example                       Configuration reference, no real credentials
```

## راه‌اندازی کوتاه فارسی

۱. برای روش بدون اشتراک میزبانی Docker، یک Space از نوع **Static** بسازید و نسخه ساخته‌شده سایت را بارگذاری کنید. API سایت در Cloudflare اجرا می‌شود. فایل `.env` یا توکن‌ها را بارگذاری نکنید.

۲. در تنظیمات محرمانه Cloudflare Pages، توکن Hugging Face را با نام `HF_TOKEN` وارد کنید. حساب Hugging Face برای پاسخ مدل به اعتبار Inference Providers نیاز دارد. این اعتبار با میزبانی رایگان فایل‌های سایت متفاوت است.

۳. ربات تلگرام در این استقرار فعال نیست؛ توکن ربات ارائه نشده و اجرای گفتگوی ربات به میزبان Node پیوسته یا پیاده‌سازی جداگانه وبهوک پایدار نیاز دارد. کد فعلی Node از `/start`، `/agree`، `/reset` و `/forget` پشتیبانی می‌کند.

۴. برای آزمایش خصوصی، از `WEB_ACCESS_TOKEN` برای سایت و `TELEGRAM_ALLOWED_USER_IDS` برای ربات استفاده کنید. توکن اصلی سرویس را در کادر کلید دسترسی سایت وارد نکنید.

این نسخه ابزار تشخیص یا پیش‌بینی پزشکی نیست. بدون توکن معتبر، پاسخ ساختگی نشان نمی‌دهد. سابقه وب و تلگرام جداست و سیاست نگهداری سرویس‌های بیرونی مستقل است.

## License and modification notice

Original project license: **GNU GPL v3**; `LICENSE` is retained. Modified on **2026-10-15 and 2026-10-16** to add the backend, integrations, deployment, tests and interface/privacy changes described above. Existing third-party dependencies and models have their own terms. Review the license and usage requirements for the model/provider you select.
