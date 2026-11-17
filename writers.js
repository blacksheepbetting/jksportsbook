(async function(){
  'use strict';
  const content=await (window.JK_EDITOR_READY||Promise.resolve(window.JK_CONTENT));
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug=value=>String(value||'').toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  const profiles=Array.isArray(content.writers)?content.writers:[];
  const stories=Array.isArray(content.stories)?content.stories:[];
  const cleanAuthor=s=>String(s.author||'').replace(/\s*\|.*$/,'').trim().toLowerCase();
  const writerId=s=>s.authorId||((profiles.find(p=>String(p.name||'').toLowerCase()===cleanAuthor(s)||p.id===cleanAuthor(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))||{}).id||'');
  const dateText=value=>{if(!value)return'';const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);const d=m?new Date(+m[1],+m[2]-1,+m[3]):new Date(value);return Number.isNaN(d.getTime())?String(value):new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(d);};
  const root=document.getElementById('writer-content');
  const card=w=>{const articles=stories.filter(s=>writerId(s)===w.id&&s.body&&!/^\s*<p>\s*coming soon:/i.test(String(s.body)));return '<article class="writer-card">'+(w.photo?'<img src="'+esc(w.photo.replace(/^\/?jksportsbook\//,'').replace(/^\/+/,''))+'" alt="Portrait of '+esc(w.name)+'" loading="lazy">':'')+'<div><h2>'+esc(w.name)+'</h2><div class="writer-role">'+esc(w.role||'JKSPORTSBOOK contributor')+'</div><p>'+esc(w.bio||'')+'</p><a href="writers.html?writer='+encodeURIComponent(w.id)+'">VIEW PROFILE · '+articles.length+' '+(articles.length===1?'STORY':'STORIES')+'</a></div></article>';};
  const params=new URLSearchParams(location.search),selected=params.get('writer');
  const profile=profiles.find(w=>w.id===selected);
  if(profile){
    document.title=profile.name+' — JKSPORTSBOOK Writers';
    document.getElementById('writers-title').textContent=profile.name+'.';
    const authored=stories.filter(s=>writerId(s)===profile.id&&s.body&&!/^\s*<p>\s*coming soon:/i.test(String(s.body)));
    const articles=authored.map(s=>'<article class="archive-card"><span class="category">'+esc(s.sport)+' / '+esc(s.category)+'</span><h2><a href="stories/'+slug(s.id)+'/">'+esc(s.title)+'</a></h2><p>'+esc(s.deck||'')+'</p><span class="meta">'+esc(profile.name)+(s.readTime?' / '+esc(s.readTime):'')+(s.publishedAt?' / '+esc(dateText(s.publishedAt)):'')+'</span></article>').join('');
    const column=profile.columnUrl?'<a href="'+esc(profile.columnUrl)+'">VISIT COLUMN</a>':'';
    root.innerHTML='<section class="writer-profile">'+(profile.photo?'<img src="'+esc(profile.photo.replace(/^\/?jksportsbook\//,'').replace(/^\/+/,''))+'" alt="Portrait of '+esc(profile.name)+'">':'')+'<div><span class="section-kicker">WRITER PROFILE</span><h1>'+esc(profile.name)+'</h1><div class="writer-role">'+esc(profile.role||'JKSPORTSBOOK contributor')+'</div><p>'+esc(profile.bio||'')+'</p><div class="writer-profile-actions">'+column+'<a href="archive.html?writer='+encodeURIComponent(profile.id)+'">FILTER THE ARCHIVE</a></div></div></section><div class="section-heading"><div><span class="section-kicker">LATEST WORK</span><h2>'+esc(authored.length+' '+(authored.length===1?'story':'stories'))+'</h2></div></div><div class="archive-grid">'+(articles||'<p class="archive-empty">New stories from this writer will appear here.</p>')+'</div>';
  }else{
    root.innerHTML='<div class="writers-grid">'+profiles.map(card).join('')+'</div>';
  }
  const menu=document.getElementById('menu-button'),nav=document.getElementById('main-nav');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
})();