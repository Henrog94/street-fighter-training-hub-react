/**
 * FightLab Wiki Importer
 * Uses MediaWiki's public API where available; does not bypass logins, CAPTCHAs,
 * access controls, or robots restrictions. Use only for permitted personal/project use.
 *
 * Run: npm run scrape -- "https://wiki.supercombo.gg/w/Street_Fighter_6"
 * Optional output: npm run scrape -- "PAGE_URL" --out public/data/wiki-import.json
 */
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const inputUrl = args.find((arg) => /^https?:\/\//i.test(arg));
if (!inputUrl) {
  console.error('Usage: npm run scrape -- "https://wiki.supercombo.gg/w/Street_Fighter_6" [--out output.json]');
  process.exit(1);
}
const outFlag = args.indexOf("--out");
const outputPath = outFlag >= 0 && args[outFlag + 1]
  ? args[outFlag + 1]
  : "public/data/wiki-import.json";
const userAgent = "FightLabEducationalImporter/1.0 (personal learning project)";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function pageTitleFromUrl(raw) {
  const url = new URL(raw);
  let title = url.pathname.split("/w/")[1] || url.pathname.split("/wiki/")[1] || "";
  title = decodeURIComponent(title).replaceAll("_", " ").replace(/\/$/, "");
  if (!title) throw new Error("Could not determine the wiki page title from this URL.");
  return title;
}
async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent, "Accept": "application/json,text/html;q=0.9,*/*;q=0.8" },
    redirect: "follow"
  });
  if (response.status === 429) {
    const retry = response.headers.get("retry-after") || "a short while";
    throw new Error(`The website rate-limited the request (HTTP 429). Retry after ${retry}; do not retry repeatedly.`);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status} while requesting ${url}`);
  return response.text();
}
async function getApiBase(origin) {
  for (const candidate of [`${origin}/w/api.php`, `${origin}/api.php`]) {
    try {
      const raw = await fetchText(`${candidate}?action=query&meta=siteinfo&format=json`);
      const data = JSON.parse(raw);
      if (data.query?.general) return candidate;
    } catch { /* Try the alternate common MediaWiki API path. */ }
  }
  return null;
}
function cleanText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|li|tr|h[1-6]|section|br|dd|dt)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function absolutize(url, base) {
  try { return new URL(url, base).href; } catch { return null; }
}
function extractFromHtml(html, baseUrl) {
  const title = cleanText((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [,""])[1]) || "Imported wiki page";
  const headings = [...html.matchAll(/<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: Number(m[1]), title: cleanText(m[2]) }))
    .filter((h) => h.title);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => {
    const src = tag.match(/\b(?:src|data-src)=["']([^"']+)["']/i)?.[1];
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || "";
    return src ? { alt: cleanText(alt), url: absolutize(src, baseUrl) } : null;
  }).filter((v) => v?.url && !v.url.startsWith("data:"));
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({ title: cleanText(m[2]), url: absolutize(m[1], baseUrl) }))
    .filter((v) => v.title && v.url && /^https?:/.test(v.url))
    .filter((v, i, all) => all.findIndex((x) => x.url === v.url && x.title === v.title) === i);
  const tables = [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map(([_, tableHtml]) => {
    const rows = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(([__, rowHtml]) =>
      [...rowHtml.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(([, cell]) => cleanText(cell))
    ).filter((row) => row.length);
    return rows.length ? rows : null;
  }).filter(Boolean);
  const content = html.match(/<div\b[^>]*class=["'][^"']*(?:mw-parser-output|mw-content-ltr)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*(?:<div\b[^>]*class=["'][^"']*printfooter|$)/i)?.[1] || html;
  return { title, headings, text: cleanText(content).slice(0, 150000), tables, images, links };
}
async function main() {
  const input = new URL(inputUrl);
  if (!["http:", "https:"].includes(input.protocol)) throw new Error("Only HTTP(S) URLs are supported.");
  const title = pageTitleFromUrl(inputUrl);
  const robotsUrl = `${input.origin}/robots.txt`;
  console.log(`Checking crawler guidance: ${robotsUrl}`);
  try {
    const robots = await fetchText(robotsUrl);
    const relevant = robots.split(/\r?\n/).filter((line) => /^(user-agent|allow|disallow|crawl-delay|sitemap)\s*:/i.test(line));
    console.log("robots.txt directives (review before broad crawling):\n" + relevant.slice(0, 30).join("\n"));
  } catch (error) {
    console.warn(`Could not read robots.txt: ${error.message}`);
  }
  const api = await getApiBase(input.origin);
  let result;
  if (api) {
    console.log(`Using MediaWiki API: ${api}`);
    const query = new URLSearchParams({
      action: "parse", page: title, prop: "text|images|sections|links", format: "json", formatversion: "2"
    });
    const data = JSON.parse(await fetchText(`${api}?${query}`));
    if (data.error) throw new Error(data.error.info || "MediaWiki API returned an error.");
    const html = data.parse.text;
    result = {
      source: inputUrl,
      fetchedAt: new Date().toISOString(),
      method: "MediaWiki API",
      title: data.parse.title,
      headings: (data.parse.sections || []).map((s) => ({ level: Number(s.level), title: s.line })),
      text: cleanText(html).slice(0, 150000),
      tables: extractFromHtml(html, inputUrl).tables,
      images: extractFromHtml(html, inputUrl).images,
      links: (data.parse.links || []).map((l) => ({ title: l["*"], url: l.exists ? `${input.origin}/w/${String(l["*"]).replaceAll(" ", "_")}` : null })).filter((l) => l.title)
    };
  } else {
    console.log("MediaWiki API not detected; trying the supplied page HTML.");
    const html = await fetchText(inputUrl);
    result = { source: inputUrl, fetchedAt: new Date().toISOString(), method: "HTML fallback", ...extractFromHtml(html, inputUrl) };
  }
  result.notice = "Imported reference data. Verify accuracy and source permissions before redistribution. Images are URLs, not copied image files.";
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2), "utf8");
  console.log(`Saved ${result.title || title} to ${outputPath}`);
  console.log(`Extracted ${result.headings?.length || 0} headings, ${result.tables?.length || 0} tables, ${result.images?.length || 0} image URLs, ${result.links?.length || 0} links.`);
}
main().catch((error) => {
  console.error(`Import failed: ${error.message}`);
  process.exitCode = 1;
});
