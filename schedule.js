(function () {
  'use strict';

  const DATA_URL = 'data/nfl-schedule.json';
  const RELEASE_URL = 'https://github.com/nflverse/nflverse-data/releases/tag/schedules';

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const byId = (id) => document.getElementById(id);
  const parseDate = (game) => {
    const value = `${game.date || ''}T${game.time || '00:00'}`;
    const parsed = new Date(value.includes('Z') ? value : `${value}Z`);
    return Number.isNaN(parsed.getTime()) ? new Date('2099-01-01T00:00:00Z') : parsed;
  };
  const dateLabel = (game) => {
    const date = parseDate(game);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' }).format(date).toUpperCase();
  };
  const kickoffLabel = (game) => {
    if (!game.time || game.time === '00:00') return 'TIME TBD';
    const match = String(game.time).match(/^(\d{1,2}):(\d{2})/);
    if (!match) return `${esc(game.time)} ET`;
    const hour = Number(match[1]);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${match[2]} ${suffix} ET`;
  };
  const isComplete = (game) => game.completed === true || (game.awayScore !== null && game.awayScore !== '' && game.homeScore !== null && game.homeScore !== '');
  const team = (value) => String(value || 'TBD').toUpperCase();
  const gameSort = (a, b) => parseDate(a) - parseDate(b);

  function futureGames(games) {
    const now = Date.now();
    return games.filter((game) => !isComplete(game) && parseDate(game).getTime() >= now - 36 * 60 * 60 * 1000).sort(gameSort);
  }

  function renderScoreboard(games) {
    const target = byId('scoreboard-games');
    if (!target) return;
    const upcoming = futureGames(games).slice(0, 3);
    if (!upcoming.length) {
      target.innerHTML = '<span class="scoreboard-empty">Schedule feed is waiting for its first refresh.</span>';
      return;
    }
    target.innerHTML = upcoming.map((game) => `<a class="scoreboard-game" href="schedule.html#week-${esc(game.week)}"><span class="scoreboard-game-date">${esc(dateLabel(game))}</span><strong>${esc(team(game.awayTeam))}</strong><span class="scoreboard-at">at</span><strong>${esc(team(game.homeTeam))}</strong><span class="scoreboard-time">${esc(kickoffLabel(game))}</span></a>`).join('');
  }

  function statusLabel(game) {
    if (isComplete(game)) return `${esc(game.awayScore)} — ${esc(game.homeScore)}`;
    return kickoffLabel(game);
  }

  function renderSchedule(data) {
    const grid = byId('week-grid');
    if (!grid) return;
    const games = Array.isArray(data.games) ? [...data.games].sort(gameSort) : [];
    const filter = document.querySelector('[data-schedule-filter].active')?.dataset.scheduleFilter || 'all';
    const filtered = games.filter((game) => filter === 'all' || (filter === 'upcoming' && !isComplete(game)) || (filter === 'results' && isComplete(game)));
    const groups = filtered.reduce((result, game) => {
      const key = game.week || 'TBD';
      (result[key] ||= []).push(game);
      return result;
    }, {});
    if (!filtered.length) {
      grid.innerHTML = `<div class="schedule-empty"><span class="section-kicker">${filter === 'results' ? 'NO RESULTS YET' : 'SCHEDULE FEED'}</span><h2>${games.length ? 'Nothing in this view yet.' : 'Waiting on the first schedule refresh.'}</h2><p>The free NFL schedule feed will populate this page automatically after the scheduled GitHub Action runs.</p></div>`;
      return;
    }
    grid.innerHTML = Object.entries(groups).map(([week, weekGames]) => `<section class="week-block" id="week-${esc(week)}"><div class="week-heading"><span class="section-kicker">NFL / WEEK ${esc(week)}</span><span>${weekGames.length} ${weekGames.length === 1 ? 'GAME' : 'GAMES'}</span></div><div class="week-games">${weekGames.map((game) => `<article class="game-card"><div class="game-date"><strong>${esc(dateLabel(game))}</strong><span>${esc(game.weekday || '')}</span></div><div class="game-matchup"><span>${esc(team(game.awayTeam))}</span><b>@</b><span>${esc(team(game.homeTeam))}</span></div><div class="game-status"><strong>${statusLabel(game)}</strong><span>${isComplete(game) ? 'FINAL' : 'KICKOFF'}</span></div><div class="game-line"><span>LINES</span><strong>COMING SOON</strong><small>Market feed not connected</small></div></article>`).join('')}</div></section>`).join('');
  }

  function renderMeta(data) {
    const updated = byId('schedule-updated');
    const season = byId('schedule-season');
    if (season) season.textContent = `${data.season || 'NFL'} SEASON`;
    if (!updated) return;
    if (!data.updatedAt) {
      updated.textContent = 'Last updated: waiting for first refresh';
      return;
    }
    const date = new Date(data.updatedAt);
    updated.textContent = `Last updated: ${Number.isNaN(date.getTime()) ? 'recently' : new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)}`;
  }

  function bindFilters(data) {
    document.querySelectorAll('[data-schedule-filter]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-schedule-filter]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderSchedule(data);
    }));
  }

  function renderError(error) {
    const message = 'Schedule feed is temporarily unavailable. The next automatic refresh will try again.';
    const target = byId('scoreboard-games');
    if (target) target.innerHTML = `<span class="scoreboard-empty">${message}</span>`;
    const grid = byId('week-grid');
    if (grid) grid.innerHTML = `<div class="schedule-empty"><span class="section-kicker">FEED STATUS</span><h2>We’ll be back on the next refresh.</h2><p>${esc(error?.message || message)}</p></div>`;
  }

  fetch(DATA_URL, { cache: 'no-store' }).then((response) => {
    if (!response.ok) throw new Error(`Schedule data returned ${response.status}`);
    return response.json();
  }).then((data) => {
    const games = Array.isArray(data.games) ? data.games : [];
    renderScoreboard(games);
    renderMeta(data);
    renderSchedule(data);
    bindFilters(data);
    const source = byId('schedule-source');
    if (source) source.href = data.sourceUrl || RELEASE_URL;
  }).catch(renderError);
})();
