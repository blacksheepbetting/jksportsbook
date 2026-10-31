/* Applies admin-edited overrides on top of the launch content. */
window.JK_EDITOR_READY = fetch('content/editor.json?v=admin-1', { cache: 'no-store' })
  .then(response => response.ok ? response.json() : {})
  .then(editor => {
    const content = window.JK_CONTENT;
    if (Array.isArray(editor.bestBets)) content.bestBets = editor.bestBets;
    if (editor.podcast && typeof editor.podcast === 'object') {
      content.podcast = { ...content.podcast, ...editor.podcast };
      if (Array.isArray(editor.podcast.episodes)) content.podcast.episodes = editor.podcast.episodes;
    }
    if (Array.isArray(editor.storyOverrides)) {
      const overrides = new Map(editor.storyOverrides.filter(item => item && item.id).map(item => [item.id, item]));
      content.stories = content.stories.map(story => overrides.has(story.id) ? { ...story, ...overrides.get(story.id) } : story);
    }
    if (Array.isArray(editor.newStories) && editor.newStories.length) content.stories = [...editor.newStories, ...content.stories];
    if (Array.isArray(editor.picks) && editor.picks.length) { content.picks = editor.picks; content.showDemoPicks = false; }
    if (Array.isArray(editor.results) && editor.results.length) { content.results = editor.results; content.showDemoPicks = false; }
    return content;
  })
  .catch(() => window.JK_CONTENT);
