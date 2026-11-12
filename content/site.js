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
  podcast: {
    title: 'The JKSPORTSBOOK Podcast',
    spotifyUrl: '',
    appleUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=qKvqZYjC1Uc',
    episodes: [
      { id: 'current-episode', title: 'The JKSPORTSBOOK Podcast — Current Episode', number: 'WATCH NOW', duration: 'YouTube', description: 'Watch the current JKSPORTSBOOK podcast episode on YouTube.', videoUrl: 'https://www.youtube.com/embed/qKvqZYjC1Uc?si=MlGdnVY7_obR_5rz', thumbnailUrl: 'https://i.ytimg.com/vi/qKvqZYjC1Uc/hqdefault.jpg', listenUrl: 'https://www.youtube.com/watch?v=qKvqZYjC1Uc' }
    ]
    // Add future episodes at the beginning of this list.
  },
  // Story IDs appear in this order in the homepage's On the Radar section.
  radarStoryIds: [
    'westgate-supercontest-history',
    'fphl-inside-the-fed',
    'why-im-helping-build-jksportsbook'
  ],
  stories: [
    {
      id: 'westgate-supercontest-history',
      title: 'Westgate History? Behold a Pale Horse.',
      sport: 'NFL', category: 'SuperContest History', type: 'feature', art: 'stadium',
      deck: 'A JKSPORTSBOOK feature on Westgate SuperContest history.',
      author: 'JKSPORTSBOOK Desk', readTime: 'Coming soon', label: 'Feature preview',
      body: `<p>Coming soon: <strong>Westgate History? Behold a Pale Horse.</strong></p>
      <p>The full JKSPORTSBOOK feature will appear here when published.</p>`
    },
    {
      id: 'welcome-to-jksportsbook', title: 'More than the score. This is JKSPORTSBOOK.',
      sport: 'All', category: 'The Big Picture', type: 'feature', art: 'stadium',
      deck: 'The stories behind the game. The takes worth debating. And a seat at the table for every fan.',
      author: 'JKSPORTSBOOK Desk', readTime: '3 min read', label: 'Launch feature',
      body: `<p>Every game ends with a score. The conversation rarely ends there.</p>
      <p>There is the decision everyone is still debating. The adjustment that changed the second half. The player whose work does not fit neatly into a highlight clip. The game you watched with friends, and the argument that somehow carried into the next morning.</p>
      <p>That is the space JKSPORTSBOOK is being built for: sports, with a point of view.</p>
      <h2>A home for the whole conversation</h2>
      <p>Start with the newsroom for original stories and analysis. Spend a little longer with the columns, where one idea gets room to breathe. Pull up the podcast when a conversation deserves more than a headline.</p>
      <p>Then there is the picks desk. Every official pick should have a clear selection, a recorded price, a stated stake, and a reason. The record should include the losses and the passes, alongside the wins.</p>
      <h2>The opening edition</h2>
      <p>This first edition introduces the publication and its sections. The reading features are original launch pieces; the picks and results marked “sample” demonstrate how the desk will work. Official picks and podcast recordings will appear when published.</p>
      <p>Good stories. Honest takes. All sports. Welcome to JKSPORTSBOOK.</p>`
    },
    {
      id: 'fphl-inside-the-fed', title: 'Inside the Fed: Hockey Without Limits. The Story of the FPHL', sport: 'FPHL',
      category: 'Inside the Fed', type: 'story', art: 'playbook', artLabel: 'FPHL<br>WITHOUT LIMITS.',
      deck: 'The story of the Federal Prospects Hockey League and the people building a game without limits.',
      author: 'Josh King', readTime: 'Coming soon', label: 'By Josh King',
      body: `<p>Coming soon: <strong>Inside the Fed: Hockey Without Limits. The Story of the FPHL</strong> by Josh King.</p>
      <p>This JKSPORTSBOOK feature will explore the league, its players, and the hockey culture that gives the FPHL its edge.</p>`
    },
    {
      id: 'sunday-starts-before-kickoff', title: 'Sunday starts long before kickoff.', sport: 'NFL',
      category: 'Inside the Game', type: 'story', art: 'stadium', artLabel: 'SUNDAY<br>STATE OF MIND.',
      deck: 'A game plan for watching football with a little more context and a lot better questions.',
      author: 'JKSPORTSBOOK Desk', readTime: '4 min read', label: 'Evergreen analysis',
      body: `<p>The first play is never really the beginning. Before the ball is snapped, there is a week of decisions hiding behind it: personnel, protection, formation, and what a coaching staff thinks its opponent will expect.</p>
      <p>Watching with that in mind makes a familiar Sunday feel a little different. The question becomes less “who made the play?” and more “why was that play available?”</p>
      <h2>Start with the matchup</h2>
      <p>A team’s identity is useful context, but a matchup is specific. Watch how an offense tries to protect its weaknesses, which defenders are asked to make difficult choices, and what changes when the down and distance changes.</p>
      <p>A completion can be a fine outcome for the defense if it forces a difficult third down. A short run can be valuable to an offense if it reveals how a front intends to respond. One result does not tell you the whole design.</p>
      <h2>Watch what changes</h2>
      <p>When a team finds something that works, the next question is how its opponent responds. Does a safety move closer to the line? Does the offense change its personnel? Does a successful pressure force a quicker passing game?</p>
      <p>Those adjustments are the conversation within the game. Follow them, and the final score begins to feel like the end of a story you actually watched unfold.</p>`
    },
    {
      id: 'basketball-beyond-box-score', title: 'The box score doesn’t tell the whole story.', sport: 'NBA',
      category: 'Beyond the Numbers', type: 'story', art: 'court', artLabel: 'READ<br>THE FLOOR.',
      deck: 'Spacing, matchups, and the work that happens when a player never touches the ball.',
      author: 'JKSPORTSBOOK Desk', readTime: '4 min read', label: 'Evergreen analysis',
      body: `<p>A box score can tell you who scored. It can tell you who rebounded, who assisted, and who struggled to make shots. It cannot show you every decision that made those numbers possible.</p>
      <p>Sometimes the most useful player in a possession is standing one pass away, keeping a defender just far enough from the action.</p>
      <h2>Look away from the ball</h2>
      <p>Watch a possession from the weak side. Notice the cut that moves a help defender, the screen that creates a favorable matchup, and the shooter whose positioning makes a drive possible.</p>
      <p>None of that means points and shooting efficiency do not matter. It means the numbers become more interesting when you can connect them to the choices on the floor.</p>
      <h2>A different kind of impact</h2>
      <p>A defender can influence a game without collecting a block. An offensive player can create a shot without receiving an assist. Basketball is full of useful work that does not fit into a simple individual total.</p>
      <p>The next time you watch, follow one player for three possessions without waiting for that player to get the ball. You might see a different game.</p>`
    },
    {
      id: 'college-football-the-matchup', title: 'Forget the logo. Watch the matchup.', sport: 'College',
      category: 'Saturday Perspective', type: 'story', art: 'playbook', artLabel: 'SATURDAY / ALL DAY',
      deck: 'Reputation gets the headline. The details decide what happens between the lines.',
      author: 'JKSPORTSBOOK Desk', readTime: '3 min read', label: 'Evergreen analysis',
      body: `<p>College football has a powerful visual language: the helmet, the stadium, the colors, the tradition. It makes the sport memorable. It can also make it easy to carry an old impression into a new matchup.</p>
      <h2>Make the question specific</h2>
      <p>Instead of asking whether a program is “good,” ask how its offensive line handles a particular defensive front. Ask how its secondary responds to motion, or what happens when its offense falls behind the chains.</p>
      <p>Those are narrower questions, and that is what makes them useful. A reputation covers years. A matchup lasts an afternoon.</p>
      <h2>Leave room to change your mind</h2>
      <p>A clear opinion is more useful when you know what could change it. Injuries, personnel, and on-field adjustments can all matter. Start with a view, then keep watching for the evidence that challenges it.</p>
      <p>The logo tells you which team is on the field. The matchup tells you what to look for.</p>`
    },
    {
      id: 'baseball-the-long-game', title: 'Baseball is a long conversation.', sport: 'MLB',
      category: 'The Long Game', type: 'story', art: 'baseball', artLabel: '162 / PERSPECTIVE',
      deck: 'Why one night is a chapter, and why context matters over a long season.',
      author: 'JKSPORTSBOOK Desk', readTime: '3 min read', label: 'Evergreen analysis',
      body: `<p>One swing can decide a night. It rarely explains an entire season.</p>
      <p>That tension is part of baseball’s appeal. The moment matters deeply, while the larger picture is always asking you to be patient.</p>
      <h2>Separate the night from the pattern</h2>
      <p>A hitter can make good contact and finish without a hit. A pitcher can execute a plan and still give up a run. Results matter, but the process behind them is worth watching too.</p>
      <p>Before turning a single game into a sweeping conclusion, ask what actually changed. Was it a new approach? A different pitch mix? A difficult defensive play? Or simply a night that did not fall one team’s way?</p>
      <h2>Keep the larger picture in view</h2>
      <p>Baseball rewards attention over time. Follow the small adjustments, remember the context, and let a pattern become a pattern before calling it one.</p>
      <p>Enjoy the ninth inning. Just leave some room for tomorrow.</p>`
    },
    {
      id: 'the-value-of-a-pass', title: 'The most underrated play? A pass.', sport: 'All',
      category: 'The Discipline Column', type: 'column', art: 'playbook',
      deck: 'Having an opinion on a game doesn’t mean you need a position on it.',
      author: 'JKSPORTSBOOK Desk', readTime: '3 min read', label: 'Opinion',
      body: `<p>There is a difference between enjoying a game, analyzing a game, and choosing to bet on a game. A strong opinion does not make all three the same thing.</p>
      <h2>Define what you actually know</h2>
      <p>If the reasoning behind a pick is mostly enthusiasm, pause. If the price moved and the original argument no longer fits, pause. If the only reason to make a pick is that the game is on television, a pass is a complete decision.</p>
      <p>No one has to take a position on every matchup. You can watch, learn, and enjoy the conversation without making a wager.</p>
      <h2>A record should tell the truth</h2>
      <p>A useful picks desk keeps its reasoning and results together. It does not erase a loss, invent a better price after the fact, or treat a winning result as proof that every part of the decision was right.</p>
      <p>Transparency makes the conversation better. Restraint deserves a place in it too.</p>
      <p class="reader-note">This column is sports commentary, not a recommendation to wager. Betting involves risk, and no outcome is guaranteed.</p>`
    },
    {
      id: 'let-the-game-breathe', title: 'Let the game breathe a little.', sport: 'All',
      category: 'From the Sidelines', type: 'column', art: 'stadium',
      deck: 'In a world of instant reactions, there is still room for a second look.',
      author: 'JKSPORTSBOOK Desk', readTime: '3 min read', label: 'Opinion',
      body: `<p>The final whistle has barely sounded and the verdicts are already arriving. Someone is finished. Someone is unstoppable. A season has been explained in a sentence.</p>
      <p>Fast reactions are part of being a fan. But the second look often gives us the better conversation.</p>
      <h2>Strong opinions can survive a question</h2>
      <p>What did the opponent do well? Which part of the game changed the choices available? What would you think about the same decision if the outcome had been different?</p>
      <p>Those questions do not take the emotion out of sports. They give the emotion something useful to argue with.</p>
      <h2>Make room for the replay</h2>
      <p>The best discussions can hold two ideas at once: a moment can be frustrating, and the explanation can be more complicated than it first appeared.</p>
      <p>Keep the passion. Take another look. There is usually a better story waiting underneath the first reaction.</p>`
    },
    {
      id: 'sports-are-better-together', title: 'The best seat is in the conversation.', sport: 'All',
      category: 'The Fan Perspective', type: 'column', art: 'court',
      deck: 'The games bring us in. The people keep us coming back.',
      author: 'JKSPORTSBOOK Desk', readTime: '2 min read', label: 'Opinion',
      body: `<p>Ask someone about a favorite game and the answer often includes a detail that never appeared on the scoreboard: who was there, where they watched, what everyone said afterward.</p>
      <p>The sport creates the moment. The conversation makes it stick.</p>
      <h2>A place to bring your point of view</h2>
      <p>A good sports community does not require everyone to agree. It works because people have different ways of seeing the same play and enough curiosity to hear one another out.</p>
      <p>That is the spirit behind the stories, columns, and podcast at JKSPORTSBOOK. Bring a take. Bring a question. Stay for the part of the discussion you did not expect.</p>`
    }
  ],
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
