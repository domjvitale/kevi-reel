// Pubblica i prossimi reel "todo" di calendario.json come TRIAL REEL via Instagram Graph API.
// Env: IG_TOKEN, IG_USER_ID, [COUNT=1], [GRADUATION=SS_PERFORMANCE|MANUAL], [IG_HOST], [IG_VERSION]
import { readFileSync, writeFileSync } from 'node:fs';

const TOKEN = process.env.IG_TOKEN;
const USER = process.env.IG_USER_ID;
const COUNT = parseInt(process.env.COUNT || '1', 10);
const GRADUATION = process.env.GRADUATION || 'SS_PERFORMANCE';
const HOST = process.env.IG_HOST || 'graph.facebook.com';
const VER = process.env.IG_VERSION || 'v27.0';
const RAW = 'https://raw.githubusercontent.com/domjvitale/kevi-reel/main/';
const CAL = new URL('../calendario.json', import.meta.url);
if (!TOKEN || !USER) { console.error('IG_TOKEN / IG_USER_ID mancanti'); process.exit(1); }

const api = (p) => `https://${HOST}/${VER}/${p}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(method, path, params = {}, tries = 3) {
  for (let i = 1; ; i++) {
    const body = new URLSearchParams({ ...params, access_token: TOKEN });
    const url = method === 'GET' ? `${api(path)}?${body}` : api(path);
    const res = await fetch(url, method === 'GET' ? {} : { method, body });
    const json = await res.json().catch(() => ({}));
    if (res.ok && !json.error) return json;
    const msg = JSON.stringify(json.error || json);
    if (i >= tries || (json.error && json.error.is_transient === false && res.status < 500)) throw new Error(`${method} ${path}: ${msg}`);
    console.warn(`retry ${i}: ${msg}`);
    await sleep(10000 * i);
  }
}

async function publish(item) {
  console.log(`EP${item.ep} → container`);
  const { id: creation_id } = await call('POST', `${USER}/media`, {
    media_type: 'REELS',
    video_url: RAW + encodeURIComponent(item.file),
    caption: item.caption,
    share_to_feed: 'true',
    trial_params: JSON.stringify({ graduation_strategy: GRADUATION }),
  });
  const deadline = Date.now() + 15 * 60 * 1000;
  for (;;) {
    const { status_code, status } = await call('GET', creation_id, { fields: 'status_code,status' });
    console.log(`  ${status_code}`);
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`container ${status_code}: ${status}`);
    if (Date.now() > deadline) throw new Error('timeout elaborazione video');
    await sleep(15000);
  }
  const { id: media_id } = await call('POST', `${USER}/media_publish`, { creation_id });
  console.log(`  pubblicato media_id=${media_id}`);
  return media_id;
}

const cal = JSON.parse(readFileSync(CAL, 'utf8'));
const todo = cal.filter((x) => x.status === 'todo').slice(0, COUNT);
if (!todo.length) { console.log('Nessun reel todo.'); process.exit(0); }

let failed = false;
for (const item of todo) {
  try {
    item.media_id = await publish(item);
    item.status = 'trial';
    item.published_at = new Date().toISOString();
  } catch (e) {
    console.error(`EP${item.ep} FALLITO: ${e.message}`);
    failed = true;
    break;
  }
  writeFileSync(CAL, JSON.stringify(cal, null, 1));
}
process.exit(failed ? 1 : 0);
