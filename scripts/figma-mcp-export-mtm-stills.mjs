/**
 * Exports Mega Toy activity still PNGs via Figma Dev Mode MCP (same engine as Cursor).
 * Requires Figma Desktop with the file open.
 *
 *   node scripts/figma-mcp-export-mtm-stills.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const MCP_URL = 'http://127.0.0.1:3845/mcp';
const OUT_DIR = path.resolve('public/case-study-toy');

const EXPORTS = [
  ['2363:2970', 'mega-toy-mtm-planters.png'],
  ['4054:1503', 'mega-toy-mtm-fortune-tiktok.png'],
  ['4054:1504', 'mega-toy-mtm-bling-bugs.png'],
  ['4054:1505', 'mega-toy-mtm-guitars-baking.png'],
];

const HEADERS = {
  Accept: 'application/json, text/event-stream',
  'Content-Type': 'application/json',
};

function parseSseJson(body) {
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('data:')) {
      const raw = line.slice(5).trim();
      if (raw) return JSON.parse(raw);
    }
  }
  throw new Error('No SSE data: line in response: ' + body.slice(0, 200));
}

async function openSession() {
  const initBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'lovable-demo-export', version: '1.0.0' },
    },
  };
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(initBody),
  });
  const sid = res.headers.get('mcp-session-id') || res.headers.get('Mcp-Session-Id');
  const text = await res.text();
  if (!sid) throw new Error('No mcp-session-id from initialize: HTTP ' + res.status);
  const msg = parseSseJson(text);
  if (msg.error) throw new Error(JSON.stringify(msg.error));

  const res2 = await fetch(MCP_URL, {
    method: 'POST',
    headers: { ...HEADERS, 'Mcp-Session-Id': sid },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
  });
  if (res2.status !== 202 && res2.status !== 200) {
    throw new Error('initialized notification failed: HTTP ' + res2.status);
  }
  return sid;
}

async function getScreenshotBase64(sessionId, nodeId) {
  const body = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_screenshot',
      arguments: { nodeId, contentsOnly: true },
    },
  };
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: { ...HEADERS, 'Mcp-Session-Id': sessionId },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const msg = parseSseJson(text);
  if (msg.error) throw new Error(JSON.stringify(msg.error));
  const content = msg.result?.content;
  if (!Array.isArray(content) || !content[0]?.data) {
    throw new Error('Unexpected screenshot result: ' + JSON.stringify(msg).slice(0, 400));
  }
  return content[0].data;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sessionId = await openSession();
  for (const [nodeId, filename] of EXPORTS) {
    const b64 = await getScreenshotBase64(sessionId, nodeId);
    const buf = Buffer.from(b64, 'base64');
    const outPath = path.join(OUT_DIR, filename);
    await sharp(buf).png({ compressionLevel: 9 }).toFile(outPath);
    const m = await sharp(outPath).metadata();
    console.log(filename, m.width, m.height);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  console.error(
    '\nIs Figma Desktop running with the portfolio file open? MCP must be reachable at',
    MCP_URL,
  );
  process.exit(1);
});
