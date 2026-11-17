(async function(){
  'use strict';
  const content=await (window.JK_EDITOR_READY||Promise.resolve(window.JK_CONTENT));
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=value=>String(value||'').toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  const stories=(Array.isArray(content.stories)?content.stories:[]).filter(s=>s&&s.id&&s.title&&s.body&&!/^\s*<p>\s*coming soon:/i.test(String(s.body)));
  const profiles=Array.isArray(content.writers)?content.writers:[];
  const cleanAuthor=s=>String(s.author||'').replace(/\s*\|.*$/,'').trim().toLowerCase();
  const writerId=s=>s.authorId||((profiles.find(p=>String(p.name||'').toLowerCase()===cleanAuthor(s)||p.id===cleanAuthor(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))||{}).id||'');
  const writerName=s=>(profiles.find(p=>p.id===writerId(s))||{}).name||s.author||'JKSPORTSBOOK Desk';
  const dateText=value=>{if(!value)return'';const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);const d=m?new Date(+m[1],+m[2]-1,+m[3]):new Date(value);return Number.isNaN(d.getTime())?String(value):new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d);};
  const coverMap={football:'assets/uploads/jksb-cover-football.jpg',basketball:'assets/uploads/jksb-cover-basketball.jpg',soccer:'assets/uploads/jksb-cover-soccer.jpg',hockey:'assets/uploads/jksb-cover-hockey.jpg','consumer-advocacy':'assets/uploads/jksb-cover-consumer-advocacy.jpg'};
  const cover=s=>{let k=String(s.coverImage||'').toLowerCase();const topic=[s.sport,s.category,s.title,s.deck].join(' ').toLowerCase();if(k==='none')return'';if(coverMap[k])return coverMap[k];if(k==='auto'||!k){k=/soccer|touchline/.test(topic)?'soccer':/fphl|hockey/.test(topic)?'hockey':/nba|cbb|basketball/.test(topic)?'basketball':/nfl|football|supercontest|raiders|seahawks/.test(topic)?'football':/consumer|dealership|automotive|car buying|sportsbook/.test(topic)?'consumer-advocacy':'';}return coverMap[k]||'';};
  const columns=content.columnSeries||{};
  const seriesNames={'jk-sportsline':columns.jkSportsline?.title||'JK Sportsline','becker-report':columns.beckerReport?.title||'The Becker Report','bossarts-board':columns.bossartsBoard?.title||"Bossart's Board",'the-touchline':columns.theTouchline?.title||'The Touchline'};
  const query=document.getElementById('archive-query'),sport=document.getElementById('archive-sport'),series=document.getElementById('archive-series'),author=document.getElementById('archive-author');
  const grid=document.getElementById('archive-grid'),status=document.getElementById('archive-status'),empty=document.getElementById('archive-empty');
  [...new Set(stories.map(s=>s.sport).filter(Boolean))].sort().forEach(v=>sport.insertAdjacentHTML('beforeend','<option value="'+esc(v)+'">'+esc(v)+'</option>'));
  [...new Set(stories.map(s=>s.series).filter(Boolean))].sort().forEach(v=>series.insertAdjacentHTML('beforeend','<option value="'+esc(v)+'">'+esc(seriesNames[v]||v)+'</option>'));
  profiles.forEach(w=>author.insertAdjacentHTML('beforeend','<option value="'+esc(w.id)+'">'+esc(w.name)+'</option>'));
  const params=new URLSearchParams(location.search);if(params.has('sport'))sport.value=params.get('sport');if(params.has('writer'))author.value=params.get('writer');if(params.has('q'))query.value=params.get('q');
  function render(){
    const term=query.value.trim().toLowerCase();
    const found=stories.filter(s=>(!sport.value||s.sport===sport.value)&&(!series.value||s.series===series.value)&&(!author.value||writerId(s)===author.value)&&(!term||[s.title,s.deck,s.sport,s.category,s.author,s.label,s.series,String(s.body||'').replace(/<[^>]*>/g,' ')].join(' ').toLowerCase().includes(term)));
    grid.innerHTML=found.map(s=>{const image=cover(s);const profile=profiles.find(p=>p.id===writerId(s));const writerLink=profile?'<a href="writers.html?writer='+encodeURIComponent(profile.id)+'">'+esc(writerName(s))+'</a>':esc(writerName(s));return '<article class="archive-card">'+(image?'<img class="archive-card-image" src="'+esc(image)+'" alt="" loading="lazy">':'<div class="archive-card-image is-empty" aria-hidden="true"></div>')+'<span class="category">'+esc(s.sport)+' / '+esc(s.category)+'</span><h2><a href="stories/'+slug(s.id)+'/">'+esc(s.title)+'</a></h2><p>'+esc(s.deck||'')+'</p><span class="meta">'+writerLink+(s.readTime?' / '+esc(s.readTime):'')+(s.publishedAt?' / '+esc(dateText(s.publishedAt)):'')+'</span></article>';}).join('');
    status.textContent=found.length+' '+(found.length===1?'story':'stories')+' in the archive';
    empty.hidden=found.length>0;
  }
  [query,sport,series,author].forEach(el=>el.addEventListener(el===query?'input':'change',render));
  const menu=document.getElementById('menu-button'),nav=document.getElementById('main-nav');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  render();
})();