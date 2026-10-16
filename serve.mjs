// Local preview for case-insights.html.
// The file is written as an Artifact page (no <html>/<head>/<body> of its own), so this server
// wraps it in the same document skeleton the Artifact viewer adds at publish time.
// Run: node serve.mjs   then open http://localhost:4173
import http from 'node:http';
import { readFile } from 'node:fs/promises';

const PORT = Number(process.env.PORT) || 4173;
const PAGE = new URL('./case-insights.html', import.meta.url);
const HEAD = '<!doctype html><html><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  '<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}' +
  'html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}' +
  'img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>';

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname !== '/' && pathname !== '/index.html') {
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('Not found');
  }
  try {
    const body = await readFile(PAGE, 'utf8');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(HEAD + body + '</body></html>');
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Could not read case-insights.html: ' + err.message);
  }
}).listen(PORT, () => console.log(`Case Insights preview running at http://localhost:${PORT}`));
