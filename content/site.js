/* JKSPORTSBOOK publishing desk.
 * Edit this file on GitHub to publish stories, columns, episodes, and picks.
 * See README.md for examples. Never put private information or API keys here.
 */
window.JK_CONTENT = {
  // Change to false and add your own picks/results when the official desk opens.
  showDemoPicks: true,
  // Current board for the homepage ticker. Keep these prices as recorded; they are not live market lines.
  bestBets: [
    { poster: 'Josh', selection: 'Bucs −2.5', odds: -110 },
    { poster: 'Q', selection: 'Browns ML', odds: 235 },
    { poster: 'Bossart', selection: 'Vikings +3.5', odds: -120 },
    { poster: 'Horse', selection: 'Bears +3', odds: -105 }
  ],
  featuredVideo: {
    youtubeUrl: 'https://www.youtube.com/watch?v=EIHViakKLdM',
    title: 'Behold a Pale Horse',
    eyebrow: 'A 65-MINUTE EXCLUSIVE',
    description: 'Josh King’s exclusive interview with the most controversial account on X.',
    startSeconds: 0
  },
  podcast: {
    title: 'The JKSPORTSBOOK Podcast',
    spotifyUrl: '',
    appleUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=DpiVE8BMugk',
    episodes: [
      { id: 'current-episode', title: 'NFL Week 10 Podcast ft. Shaun Weiss', number: 'NFL WEEK 10', duration: 'YouTube', description: 'Shaun Weiss joins the show for our NFL Week 10 episode.', videoUrl: 'https://www.youtube.com/embed/DpiVE8BMugk', thumbnailUrl: 'https://i.ytimg.com/vi/DpiVE8BMugk/hqdefault.jpg', listenUrl: 'https://www.youtube.com/watch?v=DpiVE8BMugk' }
    ]
    // Add future episodes at the beginning of this list.
  },
  // Story IDs appear in this order in the homepage's On the Radar section.
  radarStoryIds: [
    'westgate-supercontest-history',
    'fphl-inside-the-fed',
    'why-im-helping-build-jksportsbook'
  ],
  stories: [],
  // Official picks and results are empty until you publish them.
  picks: [],
  results: [],
  demoPicks: [
    {id:'demo-nfl-spread', sport:'NFL', type:'Spread', matchup:'Away Team at Home Team', selection:'Home Team −3.5', odds:-110, units:1, note:'A sample spread breakdown', body:'This is an illustrative card, not an official pick. Use this space to explain the matchup, identify the price you recorded, and state what would change your view. No live odds or fixture data is connected.'},
    {id:'demo-nba-total', sport:'NBA', type:'Total', matchup:'Away Team at Home Team', selection:'Under 224.5 points', odds:-105, units:1, note:'A sample total breakdown', body:'This is an illustrative card, not an official pick. A published total analysis can discuss pace, rotation assumptions, and the number available when the pick was posted. Record the original price instead of replacing it after the result.'},
    {id:'demo-nfl-moneyline', sport:'NFL', type:'Moneyline', matchup:'Away Team at Home Team', selection:'Away Team moneyline', odds:125, units:0.5, note:'A sample moneyline breakdown', body:'This is an illustrative card, not an official pick. The stake and price belong next to the reasoning. Use the results ledger to close out a published pick consistently, whether it wins, loses, or pushes.'}
  ],
  demoResults: [
    {sport:'NFL',type:'Spread',selection:'Sample selection A',odds:-110,units:1,result:'Win'},
    {sport:'NBA',type:'Total',selection:'Sample selection B',odds:-105,units:1,result:'Loss'},
    {sport:'NFL',type:'Moneyline',selection:'Sample selection C',odds:125,units:0.5,result:'Push'}
  ]
};
