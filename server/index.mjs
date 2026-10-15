import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { getConfig } from './config.mjs';
import { createHuggingFace } from './huggingface.mjs';
import { createHttpHandler } from './http.mjs';
import { TelegramBot } from './telegram.mjs';

if (existsSync('.env')) loadEnvFile('.env');
const config = getConfig();
const ai = createHuggingFace(config);
const telegram = new TelegramBot({ config, ai });
let handler;
const server = createServer((req, res) => handler(req, res));
server.requestTimeout = 20000;
server.headersTimeout = 10000;
let vite;
if (process.argv.includes('--dev')) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: 'spa',
  });
}
handler = createHttpHandler({
  config, ai, telegram,
  staticRoot: fileURLToPath(new URL('../dist', import.meta.url)),
  middleware: vite?.middlewares,
});
server.listen(config.port, '0.0.0.0', () => {
  console.info(`AutismBridge is listening on port ${config.port}.`);
  console.info(`Hugging Face: ${config.hfToken ? 'configured (credentials not yet verified)' : 'not configured; add HF_TOKEN to server secrets'}.`);
  telegram.start();
});
server.on('error', error => {
  console.error(`Server could not start (${error.code || 'unknown error'}).`);
  process.exitCode = 1;
});
let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  const forceExit = setTimeout(() => process.exit(0), 15000);
  forceExit.unref();
  await telegram.stop();
  await vite?.close();
  server.close(() => process.exit(0));
  server.closeIdleConnections();
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
