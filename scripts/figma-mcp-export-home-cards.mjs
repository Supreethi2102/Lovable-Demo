/**
 * Exports homepage case-study card tab images from Figma Dev Mode MCP.
 *
 *   node scripts/figma-mcp-export-home-cards.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const MCP_URL = 'http://127.0.0.1:3845/mcp';
const OUT_DIR = path.resolve('public/misc');

const EXPORTS = [
  // Retail bags (Green Cross Health)
  ['2353:845', 'retail-bags-tab-challenge.png'],
  ['2353:1021', 'retail-bags-tab-focus.png'],
  ['2353:1065', 'retail-bags-tab-impact.png'],
  ['2353:889', 'retail-bags-tab-place.png'],
  ['2353:933', 'retail-bags-tab-influence.png'],
  ['2353:977', 'retail-bags-tab-discoveries.png'],

  // Mega Toy Month
  ['2351:229', 'mega-toy-tab-challenge.png'],
  ['2351:405', 'mega-toy-tab-focus.png'],
  ['2351:449', 'mega-toy-tab-impact.png'],
  ['2351:273', 'mega-toy-tab-place.png'],
  ['2351:317', 'mega-toy-tab-influence.png'],
  ['2351:361', 'mega-toy-tab-discoveries.png'],

  // Amio Airways
  ['2354:1240', 'amio-airways-tab-challenge.png'],
  ['2354:1152', 'amio-airways-tab-focus.png'],
  ['2354:1196', 'amio-airways-tab-impact.png'],
  ['2354:1284', 'amio-airways-tab-place.png'],
  ['2354:1328', 'amio-airways-tab-influence.png'],
  ['2354:1372', 'amio-airways-tab-discoveries.png'],

  // Palmy Bank (only insights set in Figma group)
  ['2354:1459', 'palmy-bank-tab-challenge.png'],
  ['2354:1635', 'palmy-bank-tab-focus.png'],
  ['2354:1679', 'palmy-bank-tab-impact.png'],
  ['2354:1503', 'palmy-bank-tab-place.png'],
  ['2354:1547', 'palmy-bank-tab-influence.png'],
  ['2354:1591', 'palmy-bank-tab-discoveries.png'],
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
  throw new Error(`No SSE data line in response: ${body.slice(0, 200)}`);
}

async function openSession() {
  const initBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'lovable-home-card-export', version: '1.0.0' },
    },
  };

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(initBody),
  });

  const sid = res.headers.get('mcp-session-id') || res.headers.get('Mcp-Session-Id');
  const text = await res.text();
  if (!sid) throw new Error(`No mcp-session-id from initialize: HTTP ${res.status}`);

  const msg = parseSseJson(text);
  if (msg.error) throw new Error(JSON.stringify(msg.error));

  const res2 = await fetch(MCP_URL, {
    method: 'POST',
    headers: { ...HEADERS, 'Mcp-Session-Id': sid },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
  });

  if (res2.status !== 202 && res2.status !== 200) {
    throw new Error(`initialized notification failed: HTTP ${res2.status}`);
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
    throw new Error(`Unexpected screenshot result: ${JSON.stringify(msg).slice(0, 400)}`);
  }

  return content[0].data;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sessionId = await openSession();

  for (const [nodeId, filename] of EXPORTS) {
    const b64 = await getScreenshotBase64(sessionId, nodeId);
    const outPath = path.join(OUT_DIR, filename);
    await sharp(Buffer.from(b64, 'base64')).png({ compressionLevel: 9 }).toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`${filename} ${meta.width}x${meta.height}`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  console.error(`Is Figma Desktop running with the file open? MCP must be reachable at ${MCP_URL}`);
  process.exit(1);
});
