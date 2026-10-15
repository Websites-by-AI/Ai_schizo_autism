import { copyFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url);
await access(new URL('dist/index.html', root));
await build({
  entryPoints: [fileURLToPath(new URL('cloudflare/_worker.js', root))],
  outfile: fileURLToPath(new URL('dist/_worker.js', root)),
  bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true,
});
await copyFile(new URL('cloudflare/_routes.json', root), new URL('dist/_routes.json', root));
console.info('Cloudflare Pages bundle is ready in ' + fileURLToPath(new URL('dist/', root)));
console.info('Native mode: set HF_TOKEN as a Pages Secret. Optional proxy mode: set HF_SPACE_URL and PROXY_SHARED_SECRET.');
