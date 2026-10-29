'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { parseFeed } = require('../src/feed');

const xml = `<rss><channel>
<item><title>NCSC-2024-0001 [1.00] [Hoog] Kwetsbaarheid in X &amp; Y</title><link>https://advisories.ncsc.nl/a</link>
<description><![CDATA[<p>Risico</p><p>Installeer updates</p>]]></description><pubDate>Mon, 01 Jan 2024 10:00:00 GMT</pubDate><guid>1</guid></item>
<item><title>Nieuwer</title><link>javascript:alert(1)</link><description>x</description><pubDate>Tue, 02 Jan 2024 10:00:00 GMT</pubDate></item>
</channel></rss>`;

test('parseFeed parseert en sorteert items', () => {
  const items = parseFeed(xml);
  assert.strictEqual(items.length, 2);
  assert.strictEqual(items[0].title, 'Nieuwer');
  assert.strictEqual(items[0].link, '');
  assert.strictEqual(items[1].severity, 'high');
  assert.match(items[1].title, /X & Y/);
  assert.match(items[1].summary, /Installeer updates/);
});

test('parseFeed leest kans en schade uit de titelcode', () => {
  const items = parseFeed(`<rss><channel>
<item><title>NCSC-2026-1 [1.00] [M/H] Test</title><pubDate>Tue, 02 Jan 2024 10:00:00 GMT</pubDate></item>
<item><title>Zonder code</title><pubDate>Mon, 01 Jan 2024 10:00:00 GMT</pubDate></item>
</channel></rss>`);
  assert.strictEqual(items[0].likelihood, 'medium');
  assert.strictEqual(items[0].impact, 'high');
  assert.strictEqual(items[1].likelihood, '');
  assert.strictEqual(items[1].impact, '');
});
