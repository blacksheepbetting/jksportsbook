/* Loads admin-managed page copy, articles, picks, and podcast episodes. */
const JK_COLUMN_FEEDS = [
  { path: 'content/columns/general.json', series: '' },
  { path: 'content/columns/jk-sportsline.json', series: 'jk-sportsline' },
  { path: 'content/columns/becker-report.json', series: 'becker-report' },
  { path: 'content/columns/bossarts-board.json', series: 'bossarts-board' },
  { path: 'content/columns/the-touchline.json', series: 'the-touchline' }
];

window.JK_EDITOR_READY = fetch('content/editor.json?v=sitecopy-touchline-20261113', { cache: 'no-store' })
  .then(response => response.ok ? response.json() : {})
  .then(async editor => {
    const content = window.JK_CONTENT;
    if (Array.isArray(editor.bestBets)) content.bestBets = editor.bestBets;
    if (Array.isArray(editor.radarStoryIds)) content.radarStoryIds = editor.radarStoryIds;
    if (editor.siteCopy && typeof editor.siteCopy === 'object') content.siteCopy = { ...(content.siteCopy || {}), ...editor.siteCopy };
    if (editor.columnSeries && typeof editor.columnSeries === 'object') content.columnSeries = { ...(content.columnSeries || {}), ...editor.columnSeries };
    if (editor.featuredVideo && typeof editor.featuredVideo === 'object') content.featuredVideo = { ...(content.featuredVideo || {}), ...editor.featuredVideo };
    if (editor.podcast && typeof editor.podcast === 'object') {
      content.podcast = { ...content.podcast, ...editor.podcast };
      if (Array.isArray(editor.podcast.episodes)) content.podcast.episodes = editor.podcast.episodes;
    }
    if (Array.isArray(editor.storyOverrides)) {
      const overrides = new Map(editor.storyOverrides.filter(item => item && item.id).map(item => [item.id, item]));
      content.stories = content.stories.map(story => overrides.has(story.id) ? { ...story, ...overrides.get(story.id) } : story);
    }
    if (Array.isArray(editor.newStories) && editor.newStories.length) content.stories = [...editor.newStories, ...content.stories];

    const columnDocs = await Promise.all(JK_COLUMN_FEEDS.map(async feed => {
      try {
        const response = await fetch(feed.path + '?v=columns-touchline-20261113', { cache: 'no-store' });
        if (!response.ok) return [];
        const document = await response.json();
        if (!Array.isArray(document.articles)) return [];
        return document.articles
          .filter(article => article && article.id)
          .map(article => ({ ...article, type: 'column', series: feed.series }));
      } catch {
        return [];
      }
    }));
    const managedColumns = new Map();
    columnDocs.flat().forEach(article => managedColumns.set(article.id, article));
    if (managedColumns.size) {
      const managed = [...managedColumns.values()];
      const managedIds = new Set(managed.map(article => article.id));
      content.stories = [...managed, ...content.stories.filter(story => !managedIds.has(story.id))];
    }

    if (Array.isArray(editor.picks) && editor.picks.length) { content.picks = editor.picks; content.showDemoPicks = false; }
    if (Array.isArray(editor.results) && editor.results.length) { content.results = editor.results; content.showDemoPicks = false; }
    return content;
  })
  .catch(() => window.JK_CONTENT);
