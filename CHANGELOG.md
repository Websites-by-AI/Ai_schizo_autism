# Changes · 2026-10-15–2026-10-16

Based on Websites-by-AI/Ai_schizo_autism at commit `8243e4bacc7b7e0cf6da273a4cc6ff79362eef68`. The initial integration was prepared locally on `feat/huggingface-telegram`. See the 2026-10-16 deployment additions and DEPLOYMENT.md for the newly published copies.

## Added

- Same-origin Node server, Hugging Face Inference Router chat, server-owned educational system prompt and environment-based credentials.
- Telegram private-chat AI bot with explicit `/agree`, `/privacy`, `/reset`, `/forget`, `/id`, session isolation, bounded history and expiry.
- Optional consented contact-enquiry delivery to a configured Telegram admin chat.
- Rate/concurrency limits, request validation, optional website access key, safe status reporting and cancellation/timeouts.
- Non-root Dockerfile and Spaces README metadata on port 7860.
- Environment template, ignore files, setup/privacy documentation, Node tests, Playwright browser tests and CI configuration.

## Changed

- Replaced AI Lab's simulated medical scoring/prediction dashboard with a Persian/RTL educational chat interface.
- Removed associated prediction claims from home/navigation/promotional AI copy.
- Contact form no longer simulates success or makes an absolute no-third-party-sharing claim.
- Replaced the simulated footer newsletter signup with assistant/Telegram access.
- Added persistent URL/hash navigation, back/forward support, an assistant shortcut and reduced-motion/focus improvements.

## Deliberately not included

- No credentials committed, purchased inference credits, subscription upgrades or sent Telegram messages. Live deployment checks are recorded in DEPLOYMENT.md.
- No automatic deletion/replacement of an existing Telegram webhook.
- No medical diagnostic model, predictions, shared web/Telegram identity or database.
- No verification of the original site's other editorial/demo content.

## Deployment addition · 2026-10-16

- Added a Cloudflare Pages API proxy and build target. Cloudflare serves the website; the Docker Space serves the Node backend and inference requests.
- Added authenticated proxy-IP forwarding so ordinary visitors cannot spoof the Cloudflare rate-limit identity.
- New deployments are separate from existing sites; GitHub changes are published on a review branch rather than overwriting main.

- Docker Space creation returned HTTP 402 because this account requires PRO. No upgrade was purchased. Added the native Cloudflare API and a static Space deployment instead.
- Live inference checks returned HTTP 402 (no remaining Hugging Face credits). The API reports this honestly; no provider billing change was made.
