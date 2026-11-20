(async function(){
  'use strict';
  const content=await (window.JK_EDITOR_READY||Promise.resolve(window.JK_CONTENT));
  const profiles=Array.isArray(content.writers)?content.writers:[];
  const stories=Array.isArray(content.stories)?content.stories.filter(s=>s&&s.id&&s.title&&s.body&&!/^\s*<p>\s*coming soon:/i.test(String(s.body))):[];
  const episodes=Array.isArray(content.podcast?.episodes)?content.podcast.episodes:[];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=v=>String(v||'').toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  const cleanAuthor=s=>String(s.author||'').replace(/\s*\|.*$/,'').trim().toLowerCase();
  const profileForStory=s=>profiles.find(p=>p.id===s.authorId)||profiles.find(p=>String(p.name||'').trim().toLowerCase()===cleanAuthor(s)||p.id===slug(cleanAuthor(s)));
  const dateText=v=>{if(!v)return'';const d=new Date(String(v).length===10?String(v)+'T00:00:00':v);return Number.isNaN(d.getTime())?String(v):new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d);};
  const profileUrl=p=>'personalities.html?person='+encodeURIComponent(typeof p==='string'?p:p.id||'');
  const articleUrl=s=>'stories/'+slug(s.id)+'/';
  const storiesFor=p=>stories.filter(s=>{const found=profileForStory(s);return found&&found.id===p.id;});
  const socialItems=p=>[['X',p.xUrl],['Instagram',p.instagramUrl],['YouTube',p.youtubeUrl],['TikTok',p.tiktokUrl],['Website',p.websiteUrl]].filter(x=>/^https:\/\//i.test(String(x[1]||'')));
  const photoMarkup=(p,large)=>{
    const seriesKey=p.id==='brandon-bk-klein'?'bkLastLeg':'';
    const photo=p.photo||(seriesKey?content.columnSeries?.[seriesKey]?.headshot:'');
    const alt=p.id==='the-horse'?'Behold a Pale Horse logo':p.id==='corey-becker'?'Faceless profile image for '+p.name:'Portrait of '+p.name;
    return photo?'<img class="'+(large?'personality-portrait':'personality-avatar')+'" src="'+esc(String(photo).replace(/^\/?jksportsbook\//,'').replace(/^\/+/,''))+'" alt="'+esc(alt)+'" loading="lazy" decoding="async">':'<div class="'+(large?'personality-portrait personality-mark':'personality-avatar personality-mark')+'" aria-label="'+esc(p.name)+'">'+(p.id==='the-horse'?'THE<br>HORSE':esc((p.name||'JK').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase()))+'</div>';
  };
  const root=document.getElementById('personality-content');
  const selected=(new URLSearchParams(location.search).get('person')||new URLSearchParams(location.search).get('writer')||'');
  const link=s=>'<a href="'+esc(articleUrl(s))+'">'+esc(s.title)+'</a>';
  const storyCard=s=>'<article class="archive-card"><span class="category">'+esc(s.sport||'SPORTS')+' / '+esc(s.category||'STORY')+'</span><h3><a href="'+esc(articleUrl(s))+'">'+esc(s.title)+'</a></h3><p>'+esc(s.deck||'')+'</p><span class="meta">'+esc(s.readTime||'')+(s.publishedAt?' / '+esc(dateText(s.publishedAt)):'')+'</span></article>';
  function episodeCard(e){
    const url=e.listenUrl||e.videoUrl||'';
    const thumb=e.thumbnailUrl||'';
    return '<article class="personality-episode">'+(thumb?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(thumb)+'" alt="" loading="lazy"></a>':'')+'<div><span class="category">'+esc(e.number||'JKSPORTSBOOK SHOW')+(e.duration?' / '+esc(e.duration):'')+'</span><h3><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(e.title)+'</a></h3><p>'+esc(e.description||'')+'</p></div></article>';
  }
  function videoId(value){
    try{const u=new URL(value);if(!/^https:$/.test(u.protocol))return'';if(u.hostname==='youtu.be')return u.pathname.split('/').filter(Boolean)[0]||'';if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)){if(u.pathname==='/watch')return u.searchParams.get('v')||'';if(u.pathname.startsWith('/embed/'))return u.pathname.split('/')[2]||'';}}catch{}return'';
  }
  function section(title,items){
    return items?'<section class="personality-section"><header class="personality-section-heading"><span class="section-kicker">'+esc(title.kicker)+'</span><h2>'+esc(title.heading)+'</h2></header>'+items+'</section>':'';
  }
  function renderDirectory(){
    document.title='Personalities — JKSPORTSBOOK';
    document.getElementById('personalities-title').innerHTML='The <span>personalities.</span>';
    root.innerHTML='<div class="personality-directory">'+profiles.map(p=>{
      const authored=storiesFor(p).length;
      const showCount=episodes.filter(e=>(e.personalityIds||[]).includes(p.id)).length+(p.featuredVideoUrl?1:0);
      const details=[authored?authored+' '+(authored===1?'STORY':'STORIES'):'',showCount?showCount+' '+(showCount===1?'APPEARANCE':'APPEARANCES'):''].filter(Boolean).join(' · ');
      return '<a class="personality-card" href="'+esc(profileUrl(p))+'">'+photoMarkup(p,false)+'<div class="personality-card-copy"><span class="section-kicker">'+esc(p.role||'JKSPORTSBOOK')+'</span><h2>'+esc(p.name)+'</h2><p>'+esc(p.bio||'')+'</p><span class="personality-card-counts">'+esc(details||'PROFILE')+'</span><span class="personality-card-link">VIEW PROFILE <span aria-hidden="true">↗</span></span></div></a>';
    }).join('')+'</div>';
  }
  function renderProfile(p){
    document.title=p.name+' — JKSPORTSBOOK Personalities';
    document.getElementById('personalities-title').textContent=p.name+'.';
    const authored=storiesFor(p);
    const featuredIds=Array.isArray(p.featuredStoryIds)?p.featuredStoryIds.map(x=>typeof x==='string'?x:x?.storyId||x?.id).filter(Boolean):[];
    const featuredStories=featuredIds.map(id=>stories.find(s=>s.id===id)).filter(s=>s&&!authored.some(a=>a.id===s.id));
    const social=socialItems(p).map(x=>'<a href="'+esc(x[1])+'" target="_blank" rel="noopener noreferrer">'+esc(x[0])+' <span aria-hidden="true">↗</span></a>').join('');
    const profileMarkup='<section class="personality-profile">'+photoMarkup(p,true)+'<div class="personality-profile-copy"><span class="section-kicker">'+esc(p.role||'JKSPORTSBOOK')+'</span><h1>'+esc(p.name)+'</h1><p>'+esc(p.bio||'')+'</p><div class="personality-actions">'+(p.columnUrl?'<a href="'+esc(p.columnUrl)+'">VISIT COLUMN <span aria-hidden="true">↗</span></a>':'')+(social?'<div class="personality-socials" aria-label="Social links">'+social+'</div>':'')+'</div></div></section>';
    let video='';
    const vid=videoId(p.featuredVideoUrl||'');
    if(vid)video='<section class="personality-feature"><div><span class="section-kicker">FEATURED APPEARANCE</span><h2>'+esc(p.featuredVideoTitle||'Watch the conversation')+'</h2><p>'+esc(p.featuredVideoDescription||'')+'</p><a href="'+esc(p.featuredVideoUrl)+'" target="_blank" rel="noopener noreferrer">OPEN ON YOUTUBE ↗</a></div><div class="personality-video"><iframe src="https://www.youtube.com/embed/'+esc(vid)+'" title="'+esc(p.featuredVideoTitle||p.name)+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></section>';
    const related=featuredStories.length?section({kicker:'FEATURED COVERAGE',heading:'In the story.'},'<div class="archive-grid">'+featuredStories.map(storyCard).join('')+'</div>'):'';
    const writing=authored.length?section({kicker:'BY '+p.name.toUpperCase(),heading:'Articles.'},'<div class="archive-grid">'+authored.map(storyCard).join('')+'</div>'):'';
    const soundbites=(Array.isArray(content.soundbites)?content.soundbites:[])
      .filter(c=>c&&c.personalityId===p.id&&c.title&&c.audioUrl)
      .sort((a,b)=>(Date.parse(b.publishedAt||'')||0)-(Date.parse(a.publishedAt||'')||0));
    const soundbiteSection=soundbites.length?section({kicker:'HORSE AUDIO',heading:'Soundbites.'},'<div class="personality-soundbites">'+soundbites.map(c=>{
      const raw=String(c.audioUrl||'').trim();
      const src=/^https:\/\//i.test(raw)?raw:raw.replace(/^\/?jksportsbook\//i,'').replace(/^\/+/, '');
      return '<article class="personality-soundbite"><div class="personality-soundbite-copy"><span class="section-kicker">'+esc(dateText(c.publishedAt)||'AUDIO')+'</span><h3>'+esc(c.title)+'</h3>'+(c.description?'<p>'+esc(c.description)+'</p>':'')+'</div><audio controls preload="none" src="'+esc(src)+'" aria-label="Listen to '+esc(c.title)+'">Your browser does not support audio playback.</audio></article>';
    }).join('')+'</div>'):'';
    const appearances=episodes.filter(e=>(e.personalityIds||[]).includes(p.id));
    const shows=appearances.length?section({kicker:'ON THE SHOW',heading:'Podcast appearances.'},'<div class="personality-episodes">'+appearances.map(episodeCard).join('')+'</div>'):'';
    root.innerHTML=profileMarkup+video+soundbiteSection+writing+related+shows;
  }
  const profile=profiles.find(p=>p.id===selected);
  if(profile)renderProfile(profile);else renderDirectory();
  const menu=document.getElementById('menu-button'),nav=document.getElementById('main-nav');
  if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
})();