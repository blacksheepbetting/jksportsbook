#!/usr/bin/env node
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const SITE = 'https://jksportsbook.com';
const STORY_DIR = path.join(ROOT, 'stories');
const readJson = async file => JSON.parse(await readFile(path.join(ROOT, file), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');
const slug = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const cleanAuthor = story => String(story.author || '').replace(/\s*\|.*$/, '').trim().toLowerCase();
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(new Date(String(value) + 'T00:00:00Z').getTime());

function coverFor(story) {
  const map = {
    football:'assets/uploads/jksb-cover-football.jpg',
    basketball:'assets/uploads/jksb-cover-basketball.jpg',
    soccer:'assets/uploads/jksb-cover-soccer.jpg',
    hockey:'assets/uploads/jksb-cover-hockey.jpg',
    'consumer-advocacy':'assets/uploads/jksb-cover-consumer-advocacy.jpg'
  };
  let key = String(story.coverImage || '').trim().toLowerCase();
  if (key === 'none') return '';
  if (key === 'auto' || !key) {
    const topic = [story.sport, story.category, story.title, story.deck, story.series].join(' ').toLowerCase();
    key = /soccer|touchline/.test(topic) ? 'soccer'
      : /fphl|hockey/.test(topic) ? 'hockey'
      : /nba|cbb|basketball/.test(topic) ? 'basketball'
      : /nfl|football|supercontest|raiders|seahawks/.test(topic) ? 'football'
      : /consumer|dealership|automotive|car buying/.test(topic) ? 'consumer-advocacy' : '';
  }
  return map[key] || '';
}

function mediaUrl(value, story) {
  const raw = String(value || '').trim();
  if (raw) {
    if (/^https:\/\/[^\s]+$/i.test(raw)) return raw;
    const clean = raw.replace(/^\/?jksportsbook\//, '').replace(/^\/+/, '');
    if (!clean.split('/').includes('..')) return SITE + '/' + clean;
  }
  const fallback = coverFor(story) || 'assets/jksportsbook-logo.png';
  return SITE + '/' + fallback;
}

function readDate(value) {
  if (!value) return '';
  const date = validDate(value) ? new Date(String(value) + 'T00:00:00Z') : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-US', { month:'long', day:'numeric', year:'numeric', timeZone:'UTC' }).format(date);
}

async function loadContent() {
  const context = { window: {} };
  vm.runInNewContext(await readFile(path.join(ROOT, 'content/site.js'), 'utf8'), context, { timeout: 1000 });
  const content = context.window.JK_CONTENT;
  const editor = await readJson('content/editor.json');
  if (Array.isArray(editor.writers)) content.writers = editor.writers;
  if (editor.columnSeries && typeof editor.columnSeries === 'object') content.columnSeries = { ...(content.columnSeries || {}), ...editor.columnSeries };
  if (Array.isArray(editor.storyOverrides)) {
    const overrides = new Map(editor.storyOverrides.filter(item => item && item.id).map(item => [item.id, item]));
    content.stories = content.stories.map(story => overrides.has(story.id) ? { ...story, ...overrides.get(story.id) } : story);
  }
  if (Array.isArray(editor.newStories) && editor.newStories.length) content.stories = [...editor.newStories, ...content.stories];

  const feeds = [
    ['content/columns/general.json', ''],
    ['content/columns/jk-sportsline.json', 'jk-sportsline'],
    ['content/columns/becker-report.json', 'becker-report'],
    ['content/columns/bossarts-board.json', 'bossarts-board'],
    ['content/columns/the-touchline.json', 'the-touchline']
  ];
  const managed = new Map();
  for (const [file, series] of feeds) {
    try {
      const document = await readJson(file);
      for (const article of Array.isArray(document.articles) ? document.articles : []) {
        if (article && article.id) managed.set(article.id, { ...article, type:'column', series });
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const merged = [...managed.values(), ...content.stories.filter(story => !managed.has(story.id))];
  const unique = new Map();
  for (const story of merged) if (story?.id && !unique.has(story.id)) unique.set(story.id, story);
  content.stories = [...unique.values()];
  return content;
}

function writerFor(story, profiles) {
  if (story.authorId) return profiles.find(profile => profile.id === story.authorId) || null;
  const author = cleanAuthor(story);
  const authorSlug = slug(author);
  return profiles.find(profile => String(profile.name || '').trim().toLowerCase() === author || profile.id === authorSlug) || null;
}

function relatedFor(story, stories) {
  const explicit = Array.isArray(story.relatedStoryIds)
    ? story.relatedStoryIds.map(item => typeof item === 'string' ? item : item?.articleId || item?.id).filter(Boolean)
    : [];
  const byId = new Map(stories.map(item => [item.id, item]));
  const chosen = explicit.map(id => byId.get(id)).filter(item => item && item.id !== story.id);
  const fallbacks = stories.filter(item => item.id !== story.id && (story.series ? item.series === story.series : story.sport && item.sport === story.sport));
  for (const item of fallbacks) if (!chosen.some(existing => existing.id === item.id) && chosen.length < 3) chosen.push(item);
  return chosen.slice(0, 3);
}

function storyPage(story, stories, profiles) {
  const id = slug(story.id);
  if (!id || id !== story.id) return null;
  const writer = writerFor(story, profiles);
  const writerName = writer?.name || String(story.author || 'JKSPORTSBOOK Desk').replace(/\s*\|.*$/, '').trim();
  const date = readDate(story.publishedAt);
  const canonical = SITE + '/stories/' + id + '/';
  const title = story.shareTitle || story.title;
  const description = String(story.shareDescription || story.deck || 'Independent sports coverage from JKSPORTSBOOK.').replace(/\s+/g, ' ').slice(0, 240);
  const image = mediaUrl(story.shareImage, story);
  const hero = coverFor(story);
  const related = relatedFor(story, stories);
  const relatedHtml = related.length ? '<section class="story-page-related" aria-labelledby="related-heading"><span class="section-kicker">KEEP READING</span><h2 id="related-heading">Related stories.</h2><div class="article-related-grid">' + related.map(item => '<a class="article-related-card" href="../' + esc(slug(item.id)) + '/"><span class="category">' + esc(item.sport || 'SPORTS') + ' / ' + esc(item.category || 'STORY') + '</span><strong>' + esc(item.title) + '</strong><span class="meta">' + esc(item.author || 'JKSPORTSBOOK Desk') + '</span></a>').join('') + '</div></section>' : '';
  const writerCard = writer ? '<aside class="article-author-card" aria-label="About the author">' + (writer.photo ? '<img src="../../' + esc(String(writer.photo).replace(/^\/?jksportsbook\//, '').replace(/^\/+/, '')) + '" alt="Portrait of ' + esc(writer.name) + '" loading="lazy" decoding="async">' : '') + '<div><span class="section-kicker">ABOUT THE AUTHOR</span><h2>' + esc(writer.name) + '</h2><p>' + esc(writer.role || '') + '</p><a href="../../writers.html?writer=' + encodeURIComponent(writer.id) + '">VIEW WRITER PROFILE <span aria-hidden="true">↗</span></a></div></aside>' : '';
  const dateMeta = date ? ' <span aria-hidden="true">/</span> <time datetime="' + esc(story.publishedAt) + '">' + esc(date) + '</time>' : '';
  const readMeta = story.readTime ? ' <span aria-hidden="true">/</span> ' + esc(story.readTime) : '';
  const jsonLd = {
    '@context':'https://schema.org',
    '@type':'Article',
    headline: story.title,
    description,
    mainEntityOfPage: canonical,
    image: [image],
    author: { '@type':'Person', name:writerName },
    publisher: { '@type':'Organization', name:'JKSPORTSBOOK', url:SITE },
    ...(validDate(story.publishedAt) ? { datePublished:story.publishedAt } : {})
  };
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#111111">' +
    '<meta name="description" content="' + esc(description) + '"><link rel="canonical" href="' + esc(canonical) + '">' +
    '<meta property="og:type" content="article"><meta property="og:site_name" content="JKSPORTSBOOK"><meta property="og:title" content="' + esc(title) + '">' +
    '<meta property="og:description" content="' + esc(description) + '"><meta property="og:url" content="' + esc(canonical) + '"><meta property="og:image" content="' + esc(image) + '">' +
    '<meta property="og:image:alt" content="' + esc(story.title) + '"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + esc(title) + '">' +
    '<meta name="twitter:description" content="' + esc(description) + '"><meta name="twitter:image" content="' + esc(image) + '">' +
    '<title>' + esc(title) + ' — JKSPORTSBOOK</title><link rel="icon" href="../../assets/favicon.svg"><link rel="stylesheet" href="../../styles.css?v=story-pages-20261117">' +
    '<script type="application/ld+json">' + JSON.stringify(jsonLd).replace(/</g, '\\u003c') + '</script></head><body><a class="skip-link" href="#story-main">Skip to story</a>' +
    '<main id="story-main" class="story-page"><header class="story-page-top"><a class="story-page-brand" href="../../">JKSPORTSBOOK</a><nav aria-label="Article navigation"><a href="../../archive.html">STORIES</a><a href="../../columns.html">COLUMNS</a><a href="../../writers.html">WRITERS</a></nav></header>' +
    '<article class="story-page-article"><span class="section-kicker">' + esc(story.sport || 'SPORTS') + ' / ' + esc(story.category || 'STORY') + (story.series ? ' / ' + esc(story.series) : '') + '</span><h1>' + esc(story.title) + '</h1>' +
    (story.deck ? '<p class="story-page-deck">' + esc(story.deck) + '</p>' : '') +
    '<div class="story-page-meta"><span>' + (writer ? '<a href="../../writers.html?writer=' + encodeURIComponent(writer.id) + '">' + esc(writerName) + '</a>' : esc(writerName)) + readMeta + dateMeta + '</span>' +
    '<button class="article-share" type="button" id="share-story">SHARE STORY <span aria-hidden="true">↗</span></button></div>' +
    (hero ? '<img class="story-page-hero" src="../../' + esc(hero) + '" alt="' + esc(story.title) + '" loading="eager" decoding="async">' : '') +
    '<div class="story-page-body"><div class="article-body">' + String(story.body || '') + '</div></div>' + writerCard + '</article>' + relatedHtml +
    '<footer class="story-page-footer"><a href="../../">JKSPORTSBOOK / MORE THAN THE SCORE.</a><a href="../../archive.html">BACK TO ALL STORIES ↑</a></footer></main>' +
    '<script>document.getElementById("share-story").addEventListener("click",async()=>{const data={title:' + safeJson(title) + ',text:' + safeJson(description) + ',url:location.href};try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(location.href);document.getElementById("share-story").textContent="LINK COPIED";}else window.prompt("Copy this article link",location.href);}catch(e){if(e.name!=="AbortError")window.prompt("Copy this article link",location.href);}});</script></body></html>';
}

const content = await loadContent();
const stories = content.stories.filter(story => story?.id && story?.title && story?.body && !/^\s*<p>\s*coming soon:/i.test(String(story.body)));
const ids = [];
for (const story of stories) {
  const id = slug(story.id);
  if (!id || id !== story.id) continue;
  const target = path.join(STORY_DIR, id);
  await mkdir(target, { recursive:true });
  await writeFile(path.join(target, 'index.html'), storyPage(story, stories, content.writers || []), 'utf8');
  ids.push(id);
}
let previous = [];
try { previous = JSON.parse(await readFile(path.join(STORY_DIR, '.generated-ids.json'), 'utf8')); } catch {}
for (const oldId of previous) {
  if (typeof oldId === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(oldId) && !ids.includes(oldId)) {
    await rm(path.join(STORY_DIR, oldId), { recursive:true, force:true });
  }
}
await mkdir(STORY_DIR, { recursive:true });
await writeFile(path.join(STORY_DIR, '.generated-ids.json'), JSON.stringify(ids.sort(), null, 2) + '\n', 'utf8');

const urls = [
  SITE + '/', SITE + '/archive.html', SITE + '/writers.html', SITE + '/columns.html',
  SITE + '/jk-sportsline.html', SITE + '/becker-report.html', SITE + '/bossarts-board.html',
  SITE + '/the-touchline.html', SITE + '/shows.html', SITE + '/betting.html',
  ...stories.map(story => SITE + '/stories/' + slug(story.id) + '/')
];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...new Set(urls)].map(url => '  <url><loc>' + esc(url) + '</loc></url>').join('\n') + '\n</urlset>\n';
await writeFile(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('Generated ' + ids.length + ' story pages and sitemap.xml.');
