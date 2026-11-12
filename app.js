(async () => {
  'use strict';
  const content = await (window.JK_EDITOR_READY || Promise.resolve(window.JK_CONTENT));
  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const oddsText = value => Number(value) > 0 ? `+${value}` : String(value).replace('-', '−');
  const money = value => value.toLocaleString('en-US', {style:'currency',currency:'USD'});
  const validUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; } };
  const youtubeEmbed = value => { try { const url = new URL(value); return url.protocol === 'https:' && ['www.youtube.com','youtube.com'].includes(url.hostname) && url.pathname.startsWith('/embed/') ? url.href : ''; } catch { return ''; } };
  const stories = content.stories;
  const picks = content.showDemoPicks ? content.demoPicks : content.picks;
  let saved;
  try { const stored = JSON.parse(localStorage.getItem('jk-saved-picks') || '[]'); saved = new Set(Array.isArray(stored) ? stored.filter(id => typeof id === 'string') : []); } catch { saved = new Set(); }
  let activePickFilter = 'All';
  let previousFocus = null;
  let toastTimer;
  const reader = $('#reader-dialog');
  const search = $('#search-dialog');

  function art(story) {
    const label = (story.artLabel || '').split('<br>').map(esc).join('<br>');
    if (story.art === 'stadium') return `<div class="story-art art-stadium" aria-hidden="true"><img src="assets/stadium.jpg" loading="lazy" alt="" width="1672" height="941"><span class="art-label">${label}</span></div>`;
    if (story.art === 'court') return `<div class="story-art art-court" aria-hidden="true"><div class="court-lines"></div><div class="basketball"></div><span class="art-label">${label}</span></div>`;
    if (story.art === 'baseball') return '<div class="story-art art-baseball" aria-hidden="true"><div class="diamond"></div><div class="baseball"></div></div>';
    return `<div class="story-art art-playbook" aria-hidden="true"><div class="playbook-lines"></div><svg class="playbook-diagram" viewBox="0 0 250 160"><g><circle cx="35" cy="130" r="7"/><circle cx="80" cy="130" r="7"/><circle cx="125" cy="130" r="7"/><circle cx="170" cy="130" r="7"/><circle cx="215" cy="130" r="7"/><path d="M35 122V70l35-30M62 40h8v8M80 122V86h60V40m-5 7 5-7 5 7M170 122V65l32-28m-9 1 9-1-1 9M111 65l12 12m0-12-12 12M28 38l12 12m0-12L28 50M201 82l12 12m0-12-12 12"/></g></svg><span class="art-label">${label}</span></div>`;
  }

  function renderStories(filter = 'All') {
    const filtered = stories.filter(story => story.type === 'story' && (filter === 'All' || story.sport === filter));
    const visible = filter === 'All' ? filtered.slice(0, 3) : filtered;
    $('#stories-grid').innerHTML = visible.map(story => `<a class="story-card" href="#story/${esc(story.id)}">${art(story)}<span class="category">${esc(story.sport)} / ${esc(story.category)}</span><h3>${esc(story.title)}</h3><p>${esc(story.deck)}</p><span class="meta">${esc(story.author)} &nbsp; / &nbsp; ${esc(story.readTime)}</span></a>`).join('');
    $('#stories-empty').hidden = visible.length > 0;
    document.querySelectorAll('[data-filter]').forEach(button => { const active = button.dataset.filter === filter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    document.querySelectorAll('[data-sport]').forEach(link => link.classList.toggle('active', link.dataset.sport === filter));
  }

  const radarStories = content.radarStoryIds
    ? content.radarStoryIds.map(id => stories.find(story => story.id === id)).filter(Boolean)
    : stories.filter(story => story.type === 'story');
  $('#radar-stories').innerHTML = radarStories.slice(0,3).map((story,index) => `<a class="radar-story" href="#story/${esc(story.id)}"><span class="radar-number">0${index+1}</span><div><span class="category">${esc(story.sport)} / ${esc(story.category)}</span><h3>${esc(story.title)}</h3><span class="meta">${esc(story.label)} &nbsp; · &nbsp; ${esc(story.readTime)}</span></div></a>`).join('');
  $('#columns-grid').innerHTML = stories.filter(story => story.type === 'column').map(story => `<a class="column-card" href="#story/${esc(story.id)}"><span class="column-icon" aria-hidden="true">“</span><span class="category">${esc(story.category)}</span><h3>${esc(story.title)}</h3><p>${esc(story.deck)}</p><div class="column-byline"><span class="avatar" aria-hidden="true">JK</span><span class="byline-name">${esc(story.author)}<small>${esc(story.readTime)} / ${esc(story.label)}</small></span></div></a>`).join('');

  function applySiteCopy() {
    const root = content.siteCopy || {};
    document.querySelectorAll('[data-site-copy]').forEach(node => {
      const value = node.dataset.siteCopy.split('.').reduce((entry, key) => entry && entry[key], root);
      if (typeof value === 'string') node.textContent = value;
    });
  }
  function renderColumnSeries() {
    const defaults = {
      jkSportsline: { title: 'JK Sportsline', description: 'A dedicated home for JK Sportsline columns and commentary.' },
      beckerReport: { title: 'The Becker Report', description: 'A dedicated home for The Becker Report and its point of view.' }
    };
    for (const [key, seriesId] of [['jkSportsline','jk-sportsline'],['beckerReport','becker-report']]) {
      const card = document.querySelector('[data-column-series="' + key + '"]');
      if (!card) continue;
      const details = { ...defaults[key], ...(content.columnSeries?.[key] || {}) };
      card.querySelector('.column-series-title').textContent = details.title || defaults[key].title;
      card.querySelector('.column-series-description').textContent = details.description || defaults[key].description;
      const posts = stories.filter(story => story.type === 'column' && story.series === seriesId);
      const list = card.querySelector('.column-series-posts');
      const status = card.querySelector('.column-series-status');
      list.innerHTML = posts.map(story => '<a class="column-series-post" href="#story/' + esc(story.id) + '"><span class="category">' + esc(story.category) + '</span><strong>' + esc(story.title) + '</strong><span class="meta">' + esc(story.author) + ' / ' + esc(story.readTime) + '</span></a>').join('');
      if (posts.length) status.textContent = posts.length + ' COLUMN' + (posts.length === 1 ? '' : 'S') + ' PUBLISHED';
    }
  }
  function renderBestBets() {
    const target = $('#bets-ticker-track');
    const bets = Array.isArray(content.bestBets) ? content.bestBets : [];
    if (!target) return;
    const items = bets.map(bet => `<span class="bet-ticker-item"><strong>${esc(bet.poster)}:</strong> ${esc(bet.selection)} <b>${esc(oddsText(bet.odds))}</b></span>`).join('');
    target.innerHTML = bets.length
      ? `<div class="bets-ticker-marquee">${items}<span aria-hidden="true">${items}</span></div>`
      : '<span class="bets-ticker-loading">No current board posted.</span>';
  }

  function renderPodcast() {
    const episode = content.podcast.episodes[0];
    const videoLink = validUrl(episode?.listenUrl || '');
    const thumbnail = validUrl(episode?.thumbnailUrl || '');
    const video = videoLink ? `<div class="youtube-feature"><div class="youtube-feature-head"><span class="eyebrow">CURRENT EPISODE / YOUTUBE</span><a href="${esc(videoLink)}" target="_blank" rel="noopener noreferrer">OPEN ON YOUTUBE ↗</a></div><a class="youtube-poster" href="${esc(videoLink)}" target="_blank" rel="noopener noreferrer"><img src="${esc(thumbnail)}" alt="Watch ${esc(episode.title)} on YouTube" loading="lazy"><span class="youtube-play" aria-hidden="true">▶</span></a></div>` : '';
    const card = episode
      ? `<div class="episode-card"><div class="episode-icon" aria-hidden="true">▶</div><div class="episode-details"><span class="eyebrow">${esc(episode.number)} / ${esc(episode.duration)}</span><h3>${esc(episode.title)}</h3></div><a class="episode-open" href="#episode/${esc(episode.id)}" aria-label="Open ${esc(episode.title)}">↗</a></div>`
      : '<div class="episode-card"><div class="episode-icon" aria-hidden="true">↗</div><div class="episode-details"><span class="eyebrow">THE OPENING CONVERSATION</span><h3>First episode coming soon.</h3></div><a class="episode-open" href="#podcast-info" aria-label="About the JKSPORTSBOOK podcast">↗</a></div>';
    $('#featured-episode').innerHTML = video + card;
    const links = [['Spotify',content.podcast.spotifyUrl],['Apple Podcasts',content.podcast.appleUrl],['YouTube',content.podcast.youtubeUrl]].filter(([,url])=>validUrl(url));
    if (links.length) $('#podcast-platforms').innerHTML = links.map(([name,url])=>`<a href="${esc(validUrl(url))}" target="_blank" rel="noopener noreferrer">${name} ↗</a>`).join('');
  }

  function renderPicks() {
    const filtered = picks.filter(pick => activePickFilter === 'All' || (activePickFilter === 'Saved' ? saved.has(pick.id) : pick.sport === activePickFilter));
    $('#picks-list').innerHTML = filtered.map(pick => `<article class="pick-card"><div><div class="pick-meta"><b>${esc(pick.sport)} / ${esc(pick.type)}</b>${content.showDemoPicks ? 'ILLUSTRATIVE EXAMPLE' : esc(pick.postedAt || 'OFFICIAL PICK')}</div><h3>${esc(pick.matchup)}</h3><div class="pick-selection"><strong>${esc(pick.selection)}</strong><span class="odds-badge">${esc(oddsText(pick.odds))}</span><span class="unit-badge">${esc(pick.units)} UNIT${Number(pick.units) === 1 ? '' : 'S'}</span></div></div><div class="pick-controls"><button class="save-pick" data-save="${esc(pick.id)}" aria-pressed="${saved.has(pick.id)}" aria-label="${saved.has(pick.id) ? 'Unsave' : 'Save'} ${esc(pick.selection)}"><svg viewBox="0 0 20 24" aria-hidden="true"><path d="M4 2h12v19l-6-4-6 4z"/></svg></button><a class="pick-open" href="#pick/${esc(pick.id)}" aria-label="Read analysis for ${esc(pick.selection)}">↗</a></div></article>`).join('');
    $('#picks-empty').hidden = filtered.length > 0;
    $('#picks-empty').textContent = activePickFilter === 'Saved' ? 'No saved picks yet. Use the bookmark beside a pick to save it on this device.' : 'No picks posted in this section yet.';
    $('#saved-count').textContent = picks.filter(pick=>saved.has(pick.id)).length;
    if (!content.showDemoPicks) { $('#picks-status').textContent = 'THE OFFICIAL BOARD'; $('#picks-notice').textContent = 'Recorded selections and prices at the time of publication. Odds may change. No outcome is guaranteed.'; }
  }

  function renderResults() {
    const results = content.showDemoPicks ? content.demoResults : content.results;
    $('#results-body').innerHTML = results.map(result => {
      const net = result.result === 'Win' ? Number(result.units) * (Number(result.odds) > 0 ? Number(result.odds)/100 : 100/Math.abs(Number(result.odds))) : result.result === 'Loss' ? -Number(result.units) : 0;
      return `<tr><td>${esc(result.sport)} / ${esc(result.type)}</td><td>${esc(result.selection)}</td><td>${esc(oddsText(result.odds))}</td><td>${esc(result.units)}u</td><td><span class="result-tag ${result.result === 'Win' ? 'win' : ''}">${esc(result.result.toUpperCase())}</span></td><td>${net > 0 ? '+' : ''}${net.toFixed(2)}u</td></tr>`;
    }).join('') || '<tr><td colspan="6">No settled picks yet. Every official result will appear here.</td></tr>';
    if (!content.showDemoPicks) { $('#results-label').textContent = 'OFFICIAL LEDGER'; $('#results-notice').textContent = content.siteCopy?.results?.description || 'The record of published picks, with stake, original odds, and net units. Every win, loss, and push belongs here.'; }
  }

  function showToast(text) { $('#toast').textContent = text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>$('#toast').classList.remove('show'),2600); }

  function showReader({title,category,deck,author='JKSPORTSBOOK Desk',readTime='',body}) {
    if (search.open) search.close();
    const authorCard = String(author ?? '').trim().toLowerCase() === 'josh king' ? '<aside class="article-author-card" aria-label="About the author"><img src="assets/josh-king.jpg?v=josh-profile-20261112" alt="Portrait of Josh King" loading="lazy" decoding="async"><div><span class="section-kicker">ABOUT THE AUTHOR</span><h2>Josh King</h2><p>JK Sportsline</p><a href="jk-sportsline.html">MORE FROM JOSH <span aria-hidden="true">↗</span></a></div></aside>' : '';
    $('#reader-content').innerHTML = `<span class="category">${esc(category)}</span><h1 id="reader-title">${esc(title)}</h1>${deck ? `<p class="reader-deck">${esc(deck)}</p>` : ''}<div class="reader-meta">${esc(author)}${readTime ? ` &nbsp; / &nbsp; ${esc(readTime)}` : ''}</div><div class="article-body">${body}</div>${authorCard}<div class="reader-end">JKSPORTSBOOK / MORE THAN THE SCORE.</div>`;
    if (!reader.open) { previousFocus = document.activeElement; reader.showModal(); }
    reader.scrollTop = 0;
    document.title = `${title} — JKSPORTSBOOK`;
  }

  function route() {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    if (hash.startsWith('story/')) {
      const story = stories.find(item=>item.id === hash.slice(6));
      if (story) return showReader(story);
      return showReader({title:'This story is not on the desk.',category:'Story not found',body:'<p>The link may have changed. Close this window and browse the latest stories.</p>'});
    }
    if (hash.startsWith('pick/')) {
      const pick = picks.find(item=>item.id === hash.slice(5));
      if (pick) return showReader({title:pick.selection,category:`${pick.sport} / ${pick.type}${content.showDemoPicks ? ' / SAMPLE PICK' : ''}`,deck:pick.matchup,body:`<p><strong>Recorded odds: ${esc(oddsText(pick.odds))} · Stake: ${esc(pick.units)}u</strong></p><p>${esc(pick.body)}</p><p class="reader-note">${content.showDemoPicks ? 'This is a sample layout, not betting advice or a live selection. ' : ''}Odds can change. No pick is guaranteed. You can always choose not to wager.</p>`});
    }
    if (hash.startsWith('episode/')) {
      const episode = content.podcast.episodes.find(item=>item.id === hash.slice(8));
      if (episode) return showReader({title:episode.title,category:`${content.podcast.title} / ${episode.number}`,deck:episode.duration,body:`<p>${esc(episode.description)}</p>${validUrl(episode.audioUrl) ? `<audio controls preload="none" src="${esc(validUrl(episode.audioUrl))}">Your browser does not support audio playback.</audio>` : ''}${validUrl(episode.listenUrl) ? `<a class="external-episode" href="${esc(validUrl(episode.listenUrl))}" target="_blank" rel="noopener noreferrer">LISTEN TO THE EPISODE <span>↗</span></a>` : ''}`});
    }
    if (hash === 'podcast-info') return showReader({title:'The conversation is just getting started.',category:'THE JKSPORTSBOOK PODCAST',deck:'Sports, perspective, and room for a different point of view.',body:'<p>The first recording and listening links will appear here when published. Future episodes can be played directly on the site or opened in your preferred podcast app.</p><p>Until then, explore the stories and original columns in the newsroom.</p>'});
    if (hash === 'about') return showReader({title:'Welcome to the opening edition.',category:'ABOUT THIS LAUNCH',body:'<p>JKSPORTSBOOK is a sports publication with sections for original stories, columns, podcasts, and picks.</p><p>The articles in this edition are original launch features. Picks and results marked “sample” are demonstrations. No live sports data, real time odds, or official performance record is presented.</p><p>The first podcast recording and official picks will appear when published. Saved picks stay in this browser on this device. This site has no betting, payment, or account system.</p>'});
    if (reader.open) reader.close();
    document.title = 'JKSPORTSBOOK — More Than the Score';
  }

  function closeReader() { history.replaceState(null,'',location.pathname + location.search); reader.close(); document.title='JKSPORTSBOOK — More Than the Score'; }
  $('#reader-close').addEventListener('click',closeReader);
  reader.addEventListener('cancel',event=>{event.preventDefault();closeReader();});
  reader.addEventListener('close',()=>{ if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true}); });
  reader.addEventListener('click',event=>{if(event.target===reader){const rect=reader.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeReader();}});
  window.addEventListener('hashchange',route);

  document.addEventListener('click',event=>{
    const filter=event.target.closest('[data-filter]'); if(filter) renderStories(filter.dataset.filter);
    const sport=event.target.closest('[data-sport]'); if(sport) renderStories(sport.dataset.sport);
    const pickFilter=event.target.closest('[data-pick-filter]'); if(pickFilter){ activePickFilter=pickFilter.dataset.pickFilter; document.querySelectorAll('[data-pick-filter]').forEach(button=>{const active=button===pickFilter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});renderPicks(); }
    const save=event.target.closest('[data-save]'); if(save){ const id=save.dataset.save; if(saved.has(id))saved.delete(id);else saved.add(id);try{localStorage.setItem('jk-saved-picks',JSON.stringify([...saved]));}catch{showToast('Saved for this visit. Browser storage is unavailable.');}renderPicks();const replacement=document.querySelector(`[data-save="${CSS.escape(id)}"]`);if(replacement)replacement.focus({preventScroll:true}); }
    if(event.target.closest('.main-nav a')){$('#main-nav').classList.remove('open');$('#menu-button').setAttribute('aria-expanded','false');}
    if(event.target.closest('.search-result'))search.close();
  });

  $('#menu-button').addEventListener('click',()=>{const open=$('#main-nav').classList.toggle('open');$('#menu-button').setAttribute('aria-expanded',String(open));$('#menu-button').setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  $('#about-open').addEventListener('click',()=>{location.hash='about';});

  function searchStories() {
    const term=$('#search-input').value.trim().toLowerCase();
    const found=stories.filter(story=>`${story.title} ${story.deck} ${story.sport} ${story.category}`.toLowerCase().includes(term));
    $('#search-results').innerHTML=`<p class="search-count">${term ? `${found.length} ${found.length===1?'story':'stories'} found` : 'EXPLORE THE NEWSROOM'}</p>`+found.map(story=>`<a class="search-result" href="#story/${esc(story.id)}"><span class="category">${esc(story.category)} / ${esc(story.sport==='All'?'JK ORIGINALS':story.sport)}</span><h3>${esc(story.title)}</h3></a>`).join('')+(found.length?'':'<p class="empty-message">No stories found. Try a sport or a different topic.</p>');
  }
  $('#search-open').addEventListener('click',()=>{searchStories();search.showModal();$('#search-input').focus();});
  $('#search-close').addEventListener('click',()=>search.close());
  $('#search-input').addEventListener('input',searchStories);

  $('#odds-form').addEventListener('submit',event=>{
    event.preventDefault();
    const odds=Number($('#odds').value),stake=Number($('#stake').value);
    if(!Number.isFinite(odds)||!Number.isInteger(odds)||Math.abs(odds)<100){$('#calculator-result').innerHTML='<small>Please enter whole American odds of −100 or lower, or +100 or higher.</small>';$('#odds').focus();return;}
    if(!Number.isFinite(stake)||stake<=0||stake>1000000){$('#calculator-result').innerHTML='<small>Enter a stake between $0.01 and $1,000,000.</small>';$('#stake').focus();return;}
    const profit=stake*(odds>0?odds/100:100/Math.abs(odds));
    $('#calculator-result').innerHTML=`<span>Potential profit</span><strong>${money(profit)}</strong><small>Total return: ${money(stake+profit)} · Includes your ${money(stake)} stake</small>`;
  });

  $('#year').textContent = new Date().getFullYear();
  applySiteCopy();const requestedSport = new URLSearchParams(location.search).get('sport');
  const validSports = ['NFL','NBA','College','MLB'];
  renderStories(validSports.includes(requestedSport) ? requestedSport : 'All');renderPodcast();renderColumnSeries();renderPicks();renderResults();renderBestBets();route();
})();
