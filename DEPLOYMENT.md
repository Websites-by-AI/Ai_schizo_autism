# AutismBridge deployment · 16 October 2026

## Published websites

- **Cloudflare Pages:** https://autismbridge.pages.dev
- **Assistant page:** https://autismbridge.pages.dev/#ailab
- **Hugging Face Space:** https://huggingface.co/spaces/sosa123454321/autismbridge
- **Direct static app:** https://sosa123454321-autismbridge.static.hf.space

These are newly created, separate deployments. No other existing Pages project or Space was replaced. GitHub publication uses a review branch/pull request; main is not automatically replaced or merged.

## Architecture

Cloudflare Pages serves the static React website. Its `/api/*` Worker handles validation, consent, restricted CORS, rate/concurrency controls, model requests and optional contact notifications. Hugging Face hosts a static copy of the website that calls this same API.

The public build variable `VITE_API_BASE_URL` is the Pages URL. The static Space's actual app origin is allowlisted in Pages `ALLOWED_ORIGINS`. The Hugging Face inference credential exists only as an encrypted/secret `HF_TOKEN` environment value in Cloudflare Pages, not in source, frontend assets or the static Space. Other provider credentials were used only for authorized deployment operations.

The optional Node/Docker backend and Telegram polling bot remain in source, but are **not running** in this static/edge deployment.

## Verified

- `npm run check`: TypeScript passed, **44 backend/unit/edge tests passed**, production frontend built.
- `npm run test:e2e`: **5 Chromium browser tests passed** with mocked external services.
- Cloudflare homepage, `/api/health` and `/api/status`: **HTTP 200**.
- Static-Space CORS preflight: **HTTP 204** for the actual Space origin; an untrusted origin is rejected with **HTTP 403**.
- Unconsented inference request: **HTTP 400 / CONSENT_REQUIRED**.
- Real provider requests: Hugging Face returned **HTTP 402: no remaining inference credits**. The deployed API translates this into **HTTP 503 / HF_CREDITS_REQUIRED**, which the UI displays rather than fabricating an answer.
- Both published assistant pages were opened in Chromium. Their status API calls worked, the real credit error appeared, no JavaScript page exceptions were seen, and the 390px mobile viewport had no horizontal overflow.
- Source files and frontend/Worker output were checked against the deployment credentials before upload; no credential values were included.

## Remaining owner actions

1. **Revoke/rotate every credential pasted into chat**, including unused GitHub/Hugging Face keys and R2 access credentials. Account-wide tokens should not remain active after exposure. No credentials were revoked automatically because they may also be used by your other projects.
2. Create a fresh, least-privilege Hugging Face token permitting **Inference Providers calls**, and replace the Pages production `HF_TOKEN` secret. Redeploy Pages after changing its environment settings. Do not upload the token into Git or a Space file.
3. Add inference credits to the relevant Hugging Face account if you want real AI answers. **No credits, subscription or hardware upgrade was purchased.** Docker hosting had also returned HTTP 402 / PRO required, so this deployment uses a static Space instead; Docker PRO is not required for the current architecture.
4. Before funding a public endpoint, set provider-side spending caps and consider the supported `WEB_ACCESS_TOKEN` access gate. Edge rate limits are per Worker isolate, not a distributed budget guarantee.
5. **Telegram AI chat is not active:** no bot token was supplied, and a continuously running Node host or a separately implemented durable webhook service is still required. The optional Node bot supports consent, reset, forget and private chats. Contact notifications can use the edge API after an admin privately configures `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID`; no contact message delivery was tested without those credentials.
6. Review and merge the GitHub pull request if desired. The quality-check workflow does not automatically publish on merge. Future website updates require publishing the Pages bundle and the matching static bundle to the Space.

## Content and safety

The assistant is educational, not a diagnostic or clinical prediction system. Formula-based AI Lab severity/support-level/progression predictions were removed. Other original site content remains largely unchanged and has not been fact-checked or clinically validated. Review demonstration events, profiles, maps, statistics, legal guidance and checklists before representing them as verified services.

The R2 storage keys were not needed or used. No DNS, registrar, billing or unrelated website settings were changed.
