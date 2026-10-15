---
title: AutismBridge Educational Assistant
emoji: 🌿
colorFrom: green
colorTo: blue
sdk: static
app_file: site/index.html
license: gpl-3.0
---

# AutismBridge · پل اوتیسم

Persian/RTL educational website and Hugging Face-powered chat.

This Space serves the static website. The website's API runs on Cloudflare Pages Functions and calls Hugging Face Inference Providers. Provider credentials are held only in Cloudflare's secret environment settings, never in this Space's files or frontend bundle.

The original Node/Docker backend remains in the source for optional server hosting; it is not run by this static Space. Docker hosting was not enabled because the account API requires a PRO subscription; no subscription or hardware upgrade was purchased.

The assistant is educational, not a diagnosis, screening score, medication service or developmental prediction tool. Automated checks use mocked providers; see DEPLOYMENT.md for live test results and current limitations.

Telegram AI chat is not live: no bot token was provided, and the included Node polling worker requires a running Node host. The deployed edge API can send consented contact notifications once an admin configures the bot token and chat ID privately.

Source project: https://github.com/Websites-by-AI/Ai_schizo_autism

Original project license is GNU GPL v3. Modified 2026-10-15 and 2026-10-16; LICENSE is retained.
