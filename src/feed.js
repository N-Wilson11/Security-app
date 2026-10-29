'use strict';

const FEED_URL = process.env.FEED_URL || 'https://advisories.ncsc.nl/rss/advisories';

const entities = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" };

function decode(s) {
  return s.replace(/&(amp|lt|gt|quot|apos|#39);/g, (m) => entities[m]);
}

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  if (!m) return '';
  let v = m[1].trim();
  const cdata = v.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  v = cdata ? cdata[1] : decode(v);
  return v.trim();
}

function stripHtml(s) {
  let text = s.replace(/<br\s*\/?>|<\/p>|<\/li>/gi, '\n');
  let prev;
  do {
    prev = text;
    text = text.replace(/<[^>]*>/g, '');
  } while (text !== prev);
  return decode(text.replace(/[<>]/g, ''))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

function safeUrl(u) {
  return /^https?:\/\//i.test(u) ? u : '';
}

function parseFeed(xml) {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  return items
    .map((item) => {
      const title = tag(item, 'title');
      const description = stripHtml(tag(item, 'description'));
      const date = new Date(tag(item, 'pubDate'));
      const severity = (title.match(/\[(Kritiek|Hoog|Middel|Laag)\]/i) || [])[1] || '';
      return {
        id: tag(item, 'guid') || tag(item, 'link') || title,
        title,
        link: safeUrl(tag(item, 'link')),
        summary: description.slice(0, 600),
        severity: severity.toLowerCase(),
        published: isNaN(date) ? null : date.toISOString(),
      };
    })
    .filter((i) => i.title)
    .sort((a, b) => (b.published || '').localeCompare(a.published || ''));
}

async function fetchAdvisories(url = FEED_URL) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'security-app' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Feed gaf status ${res.status}`);
  return parseFeed(await res.text());
}

module.exports = { parseFeed, fetchAdvisories, FEED_URL };
