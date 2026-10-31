# JKSPORTSBOOK

A black and yellow sports publication: original stories, columns, podcasts, and a transparent picks desk. Built with HTML, CSS, and JavaScript. No dependencies or build step.

## Preview

From this folder, run `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Publish on GitHub Pages

In this repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, and save. GitHub publishes the site at `https://blacksheepbetting.github.io/jksportsbook/` after its Pages build finishes.

## Post a blog or column

Edit **content/site.js** on GitHub. Add an object to `stories`, following the existing examples. Use `type: 'story'` for the newsroom or `type: 'column'` for columns. Each `id` must be unique and use lowercase letters, numbers, and hyphens. Use one of `NFL`, `NBA`, `College`, `MLB`, or `All` for `sport`.

```js
{
  id: 'your-new-story',
  title: 'Your headline',
  sport: 'NFL',
  category: 'Your column or section',
  type: 'story',
  art: 'stadium', // stadium, court, playbook, or baseball
  deck: 'A short introduction.',
  author: 'Your name',
  readTime: '5 min read',
  label: 'Analysis',
  body: `<p>Your opening paragraph.</p><h2>A subheading</h2><p>The rest of the story.</p>`
}
```

The first three stories appear on the homepage. Other stories remain accessible through sport filters and search. Article links use `#story/your-new-story` and work on GitHub Pages without extra routing. The introductory feature has the ID `welcome-to-jksportsbook`; keep that ID if you rewrite it.

Use trusted article HTML only. Escape a backtick as `\`` inside a body string. The site does not provide an admin login or a visual content editor; GitHub is the publishing interface for this first version.

## Post a podcast

Set your show links in `podcast.spotifyUrl`, `appleUrl`, and/or `youtubeUrl`. Add episodes at the beginning of `podcast.episodes`:

```js
{
  id: 'episode-001',
  title: 'Your episode title',
  number: 'EP 001',
  duration: '45 min',
  description: 'What the conversation covers.',
  audioUrl: 'https://your-podcast-host.example/episode.mp3',
  listenUrl: 'https://your-published-episode.example'
}
```

Use a publicly accessible HTTPS audio file from your podcast host for the built-in audio player, or leave `audioUrl` empty and use `listenUrl`. Spotify, Apple Podcasts, and YouTube page URLs belong in the listening/show links, not `audioUrl`. No recording is fabricated; the launch site displays “First episode coming soon” until an episode is added.

## Publish official picks and results

The launch site uses **clearly labeled examples**. Set `showDemoPicks: false` to remove the sample picks and results. Add your actual published selections to `picks`:

```js
{
  id: 'your-unique-pick', sport: 'NFL', type: 'Spread',
  matchup: 'Away Team at Home Team', selection: 'Your selection',
  odds: -110, units: 1, postedAt: 'Your publication date and time',
  body: 'Your reasoning, assumptions, and recorded price.'
}
```

Add settled picks to `results` with `sport`, `type`, `selection`, `odds`, `units`, and `result` (`Win`, `Loss`, or `Push`). Keep the original odds and stake; the site calculates the net units. Results are manually published, not automatically fetched or independently verified. The site accepts no wagers or payments and presents no live odds.

## What works

- Responsive newsroom, sport filters, original reading features, and columns.
- Search, shareable article links, keyboard-accessible reading dialogs.
- Podcast links and HTML audio playback when real audio is configured.
- Picks breakdowns, filters, and bookmarks stored only on the visitor’s device.
- American odds calculator with input validation, stake-inclusive returns, and separate profit.
- Results ledger with odds-based net unit calculations.

## Assets

`assets/stadium.jpg` is an AI-generated editorial illustration, not a photograph of a documented event. The basketball, playbook, baseball, and podcast art are built in CSS/SVG. No third-party scripts, fonts, analytics, or trackers are loaded.

See `ASSET-NOTES.md` for the stadium generation prompt.
