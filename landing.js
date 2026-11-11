(async function () {
  'use strict';
  const content = await (window.JK_EDITOR_READY || Promise.resolve(window.JK_CONTENT));
  const root = document.querySelector('[data-landing]');
  const kind = root?.dataset.landing || '';
  const copy = content.siteCopy || {};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const get = path => path.split('.').reduce((o,k)=>o && o[k],copy);
  document.querySelectorAll('[data-site-copy]').forEach(el=>{const v=get(el.dataset.siteCopy);if(typeof v==='string')el.textContent=v;});
  const stories = Array.isArray(content.stories) ? content.stories : [];
  const pageCopy = copy.pages || {};
  const articles = list => list.length ? list.map(s=>'<article class="landing-article"><span class="category">'+esc(s.sport)+' / '+esc(s.category)+'</span><h3><a href="index.html#story/'+esc(s.id)+'">'+esc(s.title)+'</a></h3><p>'+esc(s.deck)+'</p><span class="meta">'+esc(s.author)+' / '+esc(s.readTime)+'</span></article>').join('') : '<p class="landing-empty">'+esc(pageCopy.noStories || 'No stories have been published in this section yet.')+'</p>';
  const landingSections = (copyKey,storiesFor) => {
    const data=get(copyKey)||{};
    const target=document.querySelector('[data-section-list="'+copyKey+'"]');
    if(!target)return;
    target.innerHTML=articles(storiesFor);
  };
  if(kind==='columns'){
    const columns=stories.filter(s=>s.type==='column');
    const all=document.querySelector('[data-all-columns]');
    if(all)all.innerHTML=articles(columns);
    const defs=[['jk-sportsline','jkSportsline'],['becker-report','beckerReport']];
    defs.forEach(([id,key])=>{
      const card=document.getElementById(id);
      const cfg=content.columnSeries?.[key]||{};
      if(!card)return;
      const title=card.querySelector('[data-series-title]');
      const desc=card.querySelector('[data-series-description]');
      if(title&&cfg.title)title.textContent=cfg.title;
      if(desc&&cfg.description)desc.textContent=cfg.description;
      const list=card.querySelector('[data-series-list]');
      const found=columns.filter(s=>s.series===id);
      if(list)list.innerHTML=articles(found);
    });
  }
  if(kind==='shows'){
    const target=document.querySelector('[data-show-list]');
    const episodes=content.podcast?.episodes||[];
    if(target){
      target.innerHTML=episodes.length?episodes.map((ep,index)=>{
        const thumb=ep.thumbnailUrl&&(()=>{try{return new URL(ep.thumbnailUrl).protocol==='https:'}catch{return false}})()?'<img src="'+esc(ep.thumbnailUrl)+'" alt="" loading="lazy">':'';
        const href=ep.listenUrl&&(()=>{try{return new URL(ep.listenUrl).protocol==='https:'}catch{return false}})()?ep.listenUrl:'#';
        const video=ep.videoUrl&&(()=>{try{const u=new URL(ep.videoUrl);return u.protocol==='https:'&&['www.youtube.com','youtube.com','www.youtube-nocookie.com','youtube-nocookie.com'].includes(u.hostname)&&u.pathname.startsWith('/embed/')?u.href:''}catch{return ''}})();
        const media=video?'<div class="show-player"><iframe src="'+esc(video)+'" title="'+esc(ep.title||'JKSPORTSBOOK episode')+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>':(thumb?'<a class="show-thumbnail" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+thumb+'<span>▶</span></a>':'');
        const watchLabel=pageCopy.watchListen||'WATCH / LISTEN';
        return '<article class="show-episode">'+media+'<div class="show-episode-copy"><span class="section-kicker">'+esc(ep.number||'EPISODE '+(index+1))+' / '+esc(ep.duration||'')+'</span><h2>'+esc(ep.title)+'</h2><p>'+esc(ep.description||'')+'</p><a class="button button-dark" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+esc(watchLabel)+' ↗</a></div></article>';
      }).join('') : '<p class="landing-empty">'+esc(pageCopy.noEpisodes || 'New episodes will appear here when they’re published.')+'</p>';
    }
    const title=document.querySelector('[data-podcast-title]');
    if(title&&content.podcast?.title)title.textContent=content.podcast.title;
  }
  if(kind==='betting'){
    const best=document.querySelector('[data-best-bets]');
    const bets=Array.isArray(content.bestBets)?content.bestBets:[];
    if(best)best.innerHTML=bets.length?bets.map(b=>'<div class="landing-bet"><strong>'+esc(b.poster)+'</strong><span>'+esc(b.selection)+'</span><b>'+(Number(b.odds)>0?'+':'')+esc(b.odds)+'</b></div>').join('') : '<p class="landing-empty">'+esc(pageCopy.noBets || 'No best bets are posted right now.')+'</p>';
    const picks=document.querySelector('[data-pick-list]');
    const board=content.showDemoPicks?(content.demoPicks||[]):(content.picks||[]);
    if(picks)picks.innerHTML=board.length?board.map(p=>'<article class="landing-article"><span class="category">'+esc(p.sport)+' / '+esc(p.type)+(content.showDemoPicks?' / SAMPLE':'')+'</span><h3>'+esc(p.matchup)+'</h3><p><strong>'+esc(p.selection)+' '+(Number(p.odds)>0?'+':'')+esc(p.odds)+'</strong></p><p>'+esc(p.body||p.note||'')+'</p><span class="meta">'+esc(p.postedAt||'')+'</span></article>').join('') : '<p class="landing-empty">'+esc(pageCopy.noPicks || 'No official picks have been posted yet.')+'</p>';
    for(const [section,id] of [['game-of-week','game-of-week'],['futures','futures']]){
      const target=document.querySelector('[data-betting-section="'+section+'"]');
      if(!target)continue;
      const found=stories.filter(s=>s.deskSection===section);
      target.innerHTML=articles(found);
    }
  }
  if(kind==='fphl'){
    const target=document.querySelector('[data-fphl-stories]');
    if(target)target.innerHTML=articles(stories.filter(s=>s.sport==='FPHL'));
  }
  const menu=document.getElementById('menu-button');
  const nav=document.getElementById('main-nav');
  if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  document.addEventListener('click',e=>{if(e.target.closest('#main-nav a')&&nav){nav.classList.remove('open');if(menu)menu.setAttribute('aria-expanded','false');}});
})();