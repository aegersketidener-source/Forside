'use strict';
/* Ægerske Tidender: statisk avisfront. Ingen rammeverk, ingen datainnsamling. */
const categories = [
  ['Politikk','Politikk'],['Trafikk og samferdsel','Trafikk og samferdsel'],
  ['Politi og rett','Politi og rett'],['Sport','Sport'],['Lokalsamfunn','Lokalsamfunn'],
  ['Næringsliv','Næringsliv'],['Kultur og fritid','Kultur og fritid'],
  ['Meninger','Meninger'],['Dette skjer','Dette skjer']
];
const qs = (s) => document.querySelector(s);
const esc = (s='') => String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const search = new URLSearchParams(location.search);
const articleUrl = (id) => `artikkel.html?id=${encodeURIComponent(id)}`;
const journalistUrl = (id) => `journalist.html?id=${encodeURIComponent(id)}`;
const catUrl = (cat,sub) => `kategori.html?kategori=${encodeURIComponent(cat)}${sub?'&under='+encodeURIComponent(sub):''}`;
const archival = (q) => `arkiv.html${q?'?q='+encodeURIComponent(q):''}`;
const dateOnly = (a)=>String(a?.publisert||'').slice(0,10);
const localDate = (d,opts={}) => {try{return new Intl.DateTimeFormat('nb-NO',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Oslo',...opts}).format(new Date(d));}catch{return '';}};
const stamp = (d)=>{try{return new Intl.DateTimeFormat('nb-NO',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Oslo'}).format(new Date(d));}catch{return '';}};
const imageTag = (article,extra='') => `<img src="${esc(article.bilde||'assets/stamp-factory.webp')}" alt="${esc(article.bildealt||article.tittel)}" loading="lazy" ${extra}>`;
const catKicker = a => `<span class="card-kicker">${esc(a.hovedkategori)}</span>`;
const readerBanner = () => '<div class="demo-notice"><strong>Demonstrasjonsinnhold:</strong> Sakene på denne utviklingsutgaven er eksempeltekster, ikke verifiserte nyhetssaker. Erstatt dem før offentlig lansering.</div>';
const iconStamp = (name) => name==='fabrikk' ? 'assets/stamp-factory.webp':'assets/stamp-church.webp';

function siteChrome(){
  const page=document.body.dataset.page;
  const dateText=localDate(new Date(),{weekday:'long'});
  const nav=[['Forside','index.html'],...categories.map(([label,value])=>[label,catUrl(value)] )];
  qs('#site-header').innerHTML=`<div class="site-shell" style="min-height:0;box-shadow:none">
    <header class="masthead"><div class="masthead-grid">
      <img class="masthead-engraving" src="${iconStamp('fabrikk')}" alt="" aria-hidden="true">
      <div class="logo-wrap"><a class="masthead-name" href="index.html">ÆGERSKE TIDENDER</a>
        <div class="masthead-tagline"><span class="deco-line"></span><span>Det Ægerske og Oppland</span><span class="deco-line"></span></div></div>
      <img class="masthead-engraving" src="${iconStamp('kirke')}" alt="" aria-hidden="true"></div>
      <div class="masthead-meta"><span class="meta-founded">Grunnlagt 1882</span><span>${esc(dateText.charAt(0).toUpperCase()+dateText.slice(1))}</span><a href="arkiv.html" style="text-decoration:none">Arkiv og søk</a></div></header>
    <nav class="primary-nav" aria-label="Hovedmeny">${nav.map(([label,href],i)=>{
      const isCurrent= i===0&&page==='home'||i>0&&page==='category'&&search.get('kategori')===categories[i-1][1];
      return `<a href="${href}" ${isCurrent?'aria-current="page"':''}>${esc(label)}</a>`;
    }).join('')}<button class="nav-search" id="toggle-search" type="button" title="Søk" aria-expanded="false" aria-controls="search-drawer">⌕</button></nav>
    <form class="search-drawer" id="search-drawer" action="arkiv.html" method="get" role="search"><input type="search" name="q" aria-label="Søk i artikler" placeholder="Søk etter tema, grend, journalist …" required><button type="submit">Søk</button></form></div>`;
  qs('#site-footer').innerHTML=`<footer class="site-footer">
    <div><div class="footer-logo">ÆGERSKE TIDENDER</div><div class="footer-tag">Det Ægerske og Oppland · Grunnlagt 1882</div>
      <small>Lokalavisen for Eiker, gamle Nedre Eiker, Modum, Sigdal og Krødsherad.</small><div class="footnote"><small>© ${new Date().getFullYear()} Ægerske Tidender</small></div></div>
    <div><div class="footer-title">Redaksjonen</div><a href="redaktorplakat.html">Redaktørplakat</a><a href="om.html">Om avisen</a><a href="personvern.html">Personvern</a></div>
    <div><div class="footer-title">Utforsk</div><a href="arkiv.html">Nyhetsarkiv</a><a href="annonser.html">Annonsegalleriet</a><a href="kategori.html?kategori=${encodeURIComponent('Dette skjer')}">Dette skjer</a></div>
  </footer>`;
  const btn=qs('#toggle-search');const drawer=qs('#search-drawer');
  btn.addEventListener('click',()=>{const open=drawer.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));if(open)drawer.querySelector('input').focus();});
}

function storyCard(a){return `<a class="story-card" href="${articleUrl(a.id)}">${catKicker(a)}${imageTag(a,'class="card-photo"')}<h3>${esc(a.tittel)}</h3><p>${esc(a.ingress)}</p><span class="card-meta">${esc(a.sted)} · ${stamp(a.publisert)}</span><span class="readmore">Les saken →</span></a>`;}
function listingCard(a){return `<a class="list-item" href="${articleUrl(a.id)}">${imageTag(a)}<div><small>${esc(a.hovedkategori)} · ${esc(a.sted)} · ${localDate(a.publisert)}</small><h3>${esc(a.tittel)}</h3><p>${esc(a.ingress)}</p></div></a>`;}
function adCard(a){
  if(a.bilde) return `<a class="ad ad-image" id="${esc(a.id)}" href="annonser.html#${encodeURIComponent(a.id)}" aria-label="Annonse: ${esc(a.navn)}"><img src="${esc(a.bilde)}" alt="${esc(a.bildealt||'Illustrert annonse for '+a.navn)}" loading="lazy" width="1080" height="1080"></a>`;
  return `<a class="ad ${esc(a.stil||'')}" id="${esc(a.id)}" href="annonser.html#${encodeURIComponent(a.id)}" aria-label="Annonse: ${esc(a.navn)}"><div class="ad-brand">${esc(a.navn)}</div><div class="ad-tagline">${esc(a.tagline)}</div><p class="ad-description">${esc(a.tekst)}</p><div class="ad-note">${esc(a.fotnote)}</div></a>`;
}
// Tilfeldig uttrekk uten gjentakelser ved hver sidelasting.
// 4–5 annonser velges; hvis reklamearkivet har færre, vises alle som finnes.
function randomAds(ads){
  const pool=[...ads.filter(a=>a.bilde)];
  for(let i=pool.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [pool[i],pool[j]]=[pool[j],pool[i]];
  }
  const wanted=Math.random()<.5?4:5;
  return pool.slice(0,Math.min(wanted,pool.length));
}
function adStrip(ads){
  if(!ads.length)return '';
  return `<aside class="ad-strip" aria-label="Annonser"><h2>Annonser</h2><div class="ad-grid">${ads.map(adCard).join('')}</div></aside>`;
}
function dayKeyMinus(key,days){const d=new Date(key+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-days);return d.toISOString().slice(0,10);}
function isDemo(items){return items.some(a=>a.demo===true);}
function dayView(a,key){return `<section class="day-section" id="dato-${key}"><div class="day-header"><h2>${localDate(key+'T12:00:00Z',{weekday:'long'})}</h2><span>${a.length} ${a.length===1?'sak':'saker'}</span></div>
   ${a.length?`<div class="day-grid">${a.map(storyCard).join('')}</div>`:'<p>Ingen saker publisert denne dagen.</p>'}</section>`;}
function frontPage(articles,ads){
  const selectedAds=randomAds(ads);
  const all=[...articles].sort((a,b)=>b.publisert.localeCompare(a.publisert));
  if(!all.length){qs('#content').innerHTML='<section class="paper-sheet"><h1>Forsiden</h1><p>Ingen artikler er publisert ennå.</p></section>';return;}
  const anchor=dateOnly(all[0]);const days=Array.from({length:4},(_,i)=>dayKeyMinus(anchor,i));
  let newest=all.filter(a=>dateOnly(a)===days[0]);newest.sort((a,b)=>Number(!!b.fremhevet)-Number(!!a.fremhevet)||b.publisert.localeCompare(a.publisert));
  const lead=newest[0];const three=newest.slice(1,4);const others=newest.slice(4);
  const ticker=all.slice(0,6);
  const tickerHTML=`<section class="ticker"><h2>Siste nytt</h2><ul>${ticker.map(a=>`<li><time datetime="${esc(a.publisert)}">${stamp(a.publisert)}</time><a href="${articleUrl(a.id)}">${esc(a.tittel)}</a></li>`).join('')}</ul></section>`;
  const minor=others[0]||all.find(a=>a.id!==lead.id&&!three.includes(a));
  const minorHTML=minor?`<a class="minor-feature" href="${articleUrl(minor.id)}">${imageTag(minor)}<div>${catKicker(minor)}<h3>${esc(minor.tittel)}</h3><p>${esc(minor.ingress)}</p><span class="readmore">Les mer →</span></div></a>`:'';
  const dateLabel=localDate(anchor+'T12:00:00Z',{weekday:'long'});
  let html=`${isDemo(all)?readerBanner():''}<div class="front-heading"><span class="eyebrow underlined">Eiker og omegn</span><span class="date-label">${dateLabel}</span></div>`;
  html+=`<a class="hero" href="${articleUrl(lead.id)}"><div class="hero-copy"><span class="eyebrow underlined">${esc(lead.hovedkategori)}</span><h1>${esc(lead.tittel)}</h1><p class="ingress">${esc(lead.ingress)}</p><span class="readmore">Les hele saken →</span></div>${imageTag(lead,'loading="eager" fetchpriority="high"')}</a>`;
  html+=`<div class="story-grid">${three.map(storyCard).join('')}</div>`;
  html+=`<div class="middle-grid">${tickerHTML}${minorHTML}<aside class="calendar-box"><h2>Dette skjer</h2><ul><li><strong>Grender</strong> Få med deg lokale arrangementer</li><li><strong>Kultur</strong> Konserter og forestillinger</li><li><strong>Friluft</strong> Turer og aktiviteter</li></ul><a class="readmore" href="${catUrl('Dette skjer')}">Se kalenderstoffet →</a></aside></div>`;
  html+=adStrip(selectedAds.slice(0,2));
  for(let i=1;i<days.length;i++){
    const dayArticles=all.filter(a=>dateOnly(a)===days[i]);html+=dayView(dayArticles,days[i]);
    if(i===2)html+=adStrip(selectedAds.slice(2));
  }
  html+=`<div class="archive-cta"><a class="btn" href="arkiv.html">Les eldre saker i arkivet</a></div>`;
  qs('#content').innerHTML=html;
}
function getAuthor(by,people){return people.find(p=>p.id===by)?.navn||'Redaksjonen';}
function authorPortrait(author, name, size=64){
  const initials=name.split(/\s+/).map(x=>x[0]||'').slice(0,2).join('') || 'AT';
  return author?.bilde
    ? `<img class="avatar avatar-photo" src="${esc(author.bilde)}" alt="Portrett av ${esc(name)}" width="${size}" height="${size}" data-initials="${esc(initials)}" loading="lazy">`
    : `<span class="avatar avatar-fallback" aria-hidden="true">${esc(initials)}</span>`;
}
// Fanger også opp filbaner som ikke finnes på serveren (HTTP 404).
// En synlig fallback beholdes innenfor den samme klikkbare lenken til journalisten.
document.addEventListener('error', event => {
  const img=event.target;
  if (!(img instanceof HTMLImageElement) || !img.classList.contains('avatar-photo')) return;
  const fallback=document.createElement('span');
  fallback.className='avatar avatar-fallback';
  fallback.setAttribute('aria-hidden','true');
  fallback.textContent=img.dataset.initials || 'AT';
  img.replaceWith(fallback);
}, true);
function relatedFor(a,items){return items.filter(x=>x.id!==a.id).map(x=>({a:x,score: (x.hovedkategori===a.hovedkategori?5:0)+(x.underkategori===a.underkategori?7:0)+(x.sted===a.sted?2:0)+(x.tags||[]).filter(t=>(a.tags||[]).includes(t)).length*3})).sort((p,q)=>q.score-p.score||q.a.publisert.localeCompare(p.a.publisert)).map(o=>o.a);}
function articlePage(items,people,ads){
  const id=search.get('id');const a=items.find(x=>x.id===id);if(!a){qs('#content').innerHTML='<section class="paper-sheet"><h1>Artikkelen finnes ikke</h1><p><a href="arkiv.html">Søk i arkivet</a></p></section>';return;}
  document.title=`${a.tittel} – Ægerske Tidender`;
  const author=people.find(p=>p.id===a.journalist_id);
  const name=author?.navn||'Redaksjonen';
  const portrait=authorPortrait(author,name);
  const related=relatedFor(a,items);const max=related.length;
  const visualAds=(ads||[]).filter(x=>x.bilde);
  const adIndex=Math.floor(Math.random()*Math.max(1,visualAds.length));
  const articleAd=visualAds.length?`<aside class="article-ad-slot" aria-label="Annonse"><h2>Annonse</h2>${adCard(visualAds[adIndex])}</aside>`:'';
  qs('#content').innerHTML=`${a.demo?readerBanner():''}<div class="article-container"><div class="breadcrumbs"><a href="index.html">Forside</a> › <a href="${catUrl(a.hovedkategori)}">${esc(a.hovedkategori)}</a> › <span>${esc(a.tittel)}</span></div>
    <div class="article-kicker"><a class="eyebrow underlined" href="${catUrl(a.hovedkategori,a.underkategori)}">${esc(a.underkategori)}</a></div><h1 class="article-title">${esc(a.tittel)}</h1><p class="article-ingress">${esc(a.ingress)}</p>
    <div class="byline"><a class="author-portrait-link" href="${journalistUrl(a.journalist_id)}" aria-label="Les om ${esc(name)}">${portrait}</a><a class="author-name" href="${journalistUrl(a.journalist_id)}">Av ${esc(name)}</a><span>▣ ${localDate(a.publisert)} kl. ${stamp(a.publisert)}</span>${a.oppdatert?`<span>Oppdatert: ${localDate(a.oppdatert)} kl. ${stamp(a.oppdatert)}</span>`:''}</div>
    <figure class="article-photo">${imageTag(a,'loading="eager"')}<figcaption>${esc(a.bildealt||'Illustrasjonsbilde')}</figcaption></figure>
    <div class="article-main"><div><div class="article-text">${(a.tekst||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
      <div class="topics"><span class="eyebrow" style="margin-right:9px">Emner:</span>${(a.tags||[]).map(t=>`<a class="topic" href="${archival(t)}">${esc(t)}</a>`).join('')}</div></div>
      <aside class="fact-side"><h3>Om saken</h3><dl><dt>Sted</dt><dd>${esc(a.sted)}</dd><dt>Hovedkategori</dt><dd><a href="${catUrl(a.hovedkategori)}">${esc(a.hovedkategori)}</a></dd><dt>Underkategori</dt><dd><a href="${catUrl(a.hovedkategori,a.underkategori)}">${esc(a.underkategori)}</a></dd><dt>Journalist</dt><dd><a href="${journalistUrl(a.journalist_id)}">${esc(name)}</a></dd></dl></aside></div>
    ${articleAd}<section class="related-below"><span class="eyebrow">Videre lesning</span><h2>Beslektede emner og saker</h2><p class="related-note">Sakene velges automatisk ut fra emner, sted og kategori. Flere vises når du blar nedover.</p>
      <div class="related-grid" id="related-grid">${related.slice(0,6).map(storyCard).join('')}</div>
      ${max>6?'<div class="related-more"><button type="button" class="btn" id="show-more">Vis flere beslektede saker</button></div>':''}
    </section></div>`;
  let shown=6;qs('#show-more')?.addEventListener('click',()=>{const next=related.slice(shown,shown+6);qs('#related-grid').insertAdjacentHTML('beforeend',next.map(storyCard).join(''));shown+=next.length;if(shown>=related.length)qs('#show-more').remove();});
}
function categoryPage(items,emner){
  const cat=search.get('kategori')||'Politikk';const sub=search.get('under')||'';
  const known=categories.some(x=>x[1]===cat);if(!known){qs('#content').innerHTML='<section class="paper-sheet"><h1>Ukjent kategori</h1><a href="index.html">Forsiden</a></section>';return;}
  const allTopics=[...new Set(emner.filter(e=>e.hovedkategori===cat).map(e=>e.underkategori))].sort((a,b)=>a.localeCompare(b,'nb'));
  const found=items.filter(a=>a.hovedkategori===cat&&(!sub||a.underkategori===sub)).sort((a,b)=>b.publisert.localeCompare(a.publisert));
  document.title=`${cat}${sub?' – '+sub:''} – Ægerske Tidender`;
  qs('#content').innerHTML=`${isDemo(found)?readerBanner():''}<div class="page-intro"><span class="eyebrow underlined">Stoffområde</span><h1>${esc(cat)}</h1><p class="intro-lead">${sub?`Undertema: ${esc(sub)}.`:'Velg underkategori for å avgrense stoffet.'} ${found.length} ${found.length===1?'artikkel':'artikler'} i arkivet.</p></div>
    <nav aria-label="Underkategorier" class="filter-pills"><a class="${!sub?'selected':''}" href="${catUrl(cat)}">Alle</a>${allTopics.map(x=>`<a class="${x===sub?'selected':''}" href="${catUrl(cat,x)}">${esc(x)}</a>`).join('')}</nav>
    ${found.length?`<div class="listing">${found.map(listingCard).join('')}</div>`:'<p>Ingen artikler er publisert i denne underkategorien ennå.</p>'}`;
}
function journalistPage(items,people){
  const id=search.get('id')||'';
  const author=people.find(p=>p.id===id);
  if(!author){qs('#content').innerHTML='<section class="paper-sheet"><h1>Journalisten finnes ikke</h1><p><a href="arkiv.html">Til nyhetsarkivet</a></p></section>';return;}
  const authored=items.filter(a=>a.journalist_id===id).sort((a,b)=>b.publisert.localeCompare(a.publisert));
  const fields=[...new Set(authored.map(a=>a.hovedkategori))];
  document.title=`${author.navn} – Ægerske Tidender`;
  qs('#content').innerHTML=`${isDemo(authored)?readerBanner():''}<section class="journalist-profile paper-sheet">
    <div class="breadcrumbs"><a href="index.html">Forside</a> › <span>Journalist</span></div>
    <div class="journalist-profile-head"><div class="journalist-profile-photo">${authorPortrait(author,author.navn,128)}</div><div>
      <span class="eyebrow underlined">Journalist i Ægerske Tidender</span><h1>${esc(author.navn)}</h1>
      ${author.rolle?`<p class="profile-role">${esc(author.rolle)}</p>`:''}
      ${author.biografi?`<p class="profile-bio">${esc(author.biografi)}</p>`:''}
      <p class="profile-count">${authored.length} ${authored.length===1?'artikkel':'artikler'}${fields.length?' · '+fields.map(esc).join(' · '):''}</p>
    </div></div>
    <h2>Artikler av ${esc(author.navn)}</h2>
    <div class="listing">${authored.map(listingCard).join('')||'<p>Ingen artikler publisert ennå.</p>'}</div>
    <p><a href="arkiv.html?journalist=${encodeURIComponent(id)}">Vis treff i arkivsøket →</a></p>
  </section>`;
}
function archivePage(items,people){
  const q=(search.get('q')||'').trim();const journalist=search.get('journalist')||'';
  const corpus=a=>[a.tittel,a.ingress,a.sted,a.hovedkategori,a.underkategori,(a.tags||[]).join(' '),getAuthor(a.journalist_id,people)].join(' ').toLocaleLowerCase('nb-NO');
  const found=items.filter(a=>(!journalist||a.journalist_id===journalist)&&(!q||corpus(a).includes(q.toLocaleLowerCase('nb-NO')))).sort((a,b)=>b.publisert.localeCompare(a.publisert));
  document.title='Arkiv og søk – Ægerske Tidender';
  qs('#content').innerHTML=`${isDemo(found)?readerBanner():''}<div class="page-intro"><span class="eyebrow underlined">Historien fortsetter</span><h1>Nyhetsarkivet</h1><p class="intro-lead">Søk i publiserte artikler etter navn, sted, emne eller journalist.</p></div>
    <form class="archive-search" method="get" action="arkiv.html"><input type="search" name="q" value="${esc(q)}" aria-label="Søketekst" placeholder="Søk i avisen …"><button class="btn" type="submit">Søk</button></form>
    <p class="status">${found.length} treff${journalist?' for '+esc(getAuthor(journalist,people)):''}${q?' på «'+esc(q)+'»':''}.</p>
    <div class="listing">${found.map(listingCard).join('')||'<p>Ingen treff. Prøv et annet søkeord.</p>'}</div>`;
}
function staticPage(page,ads){
  const root=qs('#content');
  if(page==='editor')root.innerHTML=`<article class="paper-sheet"><p class="eyebrow underlined">Redaksjonelle prinsipper</p><h1>Redaktørplakat</h1>
    <p class="intro">Ægerske Tidender skal være en selvstendig lokalavis som undersøker, forklarer og belyser forhold som angår Eiker og oppland.</p>
    <section class="principle"><h2>1. Redaksjonell uavhengighet</h2><p>Redaktøren avgjør hvilke saker som publiseres, hvordan de behandles, og hvilke synspunkter som får plass. Annonsører, politikere og andre utenfor redaksjonen skal ikke styre det journalistiske innholdet.</p></section>
    <section class="principle"><h2>2. Dokumentasjon og kildekritikk</h2><p>Opplysninger skal kontrolleres så langt det er mulig, og leseren skal forstå hva som er dokumentert, hva som er påstand, og hva som er redaksjonell vurdering. Berørte parter skal få mulighet til å svare når omtalen tilsier det.</p></section>
    <section class="principle"><h2>3. Nyheter, meninger og reklame</h2><p>Nyhetsjournalistikk, analyser, kommentarer og annonser skal kunne skilles klart fra hverandre. Redaksjonelle omtaler kan ikke kjøpes, og annonseplass gir ingen særrett til positiv omtale.</p></section>
    <section class="principle"><h2>4. Åpenhet og rettelser</h2><p>Vesentlige feil skal rettes synlig og snarest mulig. Oppdateringer av betydning skal merkes med dato og klokkeslett. Kildebruk, habilitet og interessekonflikter håndteres åpent.</p></section>
    <section class="principle"><h2>5. Lokal tilstedeværelse</h2><p>Avisens geografiske oppdrag er Øvre Eiker, gamle Nedre Eiker, Modum, Sigdal og Krødsherad. Mindre bygder og grender skal ikke bli oversett til fordel for de største tettstedene.</p></section>
    <section class="principle"><h2>6. Redaktøransvar</h2><p>Ansvarlig redaktør skal ha reell myndighet til å ta de endelige redaksjonelle beslutningene og står ansvarlig for publiseringene.</p></section>
    <p>Les også <a href="https://www.redaktor.no/ressurser/etiske-og-juridiske-rammeverk/redaktorplakaten" rel="noopener noreferrer" target="_blank">Norsk Redaktørforenings Redaktørplakaten</a> og <a href="https://presse.no/pfu/etiske-regler/vaer-varsom-plakaten/" rel="noopener noreferrer" target="_blank">Vær Varsom-plakaten</a>.</p>
    </article>`;
  if(page==='ads')root.innerHTML=`<section class="paper-sheet"><p class="eyebrow underlined">Handel og annonser</p><h1>Annonsegalleriet</h1><p class="intro">Her finner du Ægerske Tidenders illustrerte annonser i klassisk avisstil. Nye bilder legges direkte i reklamearkivet.</p>
    <div class="ads-page-grid">${ads.map(adCard).join('')}</div><p>Annonser merkes tydelig og holdes adskilt fra redaksjonelt innhold.</p></section>`;
  if(page==='about')root.innerHTML=`<section class="paper-sheet"><p class="eyebrow underlined">Avisens historie</p><h1>Ægerske Tidender</h1><p class="intro">Det Ægerske og Oppland. Grunnlagt 1882.</p>
    <p>Avisen dekker Øvre Eiker, det tidligere Nedre Eiker, Modum, Sigdal og Krødsherad. Vi følger det som skjer i kommunestyrene, langs veiene, på idrettsbanene, i industrien og i de små grendene.</p>
    <h2>En gammel avis i ny drakt</h2><p>Den historiske avisestetikken er inspirert av 1930- og 1940-tallet, mens lesbarhet, søk og mobilvisning er laget for dagens nettpublisering.</p>
    <h2>Redaksjon og etikk</h2><p>Les <a href="redaktorplakat.html">avisens redaktørplakat</a> for våre prinsipper om kildekritikk, uavhengighet og synlige rettelser.</p></section>`;
  if(page==='privacy')root.innerHTML=`<section class="paper-sheet"><p class="eyebrow underlined">Åpenhet</p><h1>Personvern</h1><p>Denne utgaven av Ægerske Tidender bruker ikke informasjonskapsler, tredjepartsanalyse, brukerkontoer eller sporingsskript.</p><p>Søket skjer i nettleseren ved hjelp av avisens åpne JSON-artikkelregister. Søkeordet vises i adresselinjen, men sendes ikke til vår egen server for behandling.</p><p>GitHub Pages kan behandle tekniske opplysninger i forbindelse med vanlig levering av nettsider. Se <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHubs personvernerklæring</a>.</p></section>`;
}
async function getJSON(path){const response=await fetch(path,{cache:'no-store'});if(!response.ok)throw new Error('Kan ikke lese '+path);return response.json();}
async function init(){siteChrome();const page=document.body.dataset.page;
  try{
    if(['home','article','category','archive','journalist'].includes(page)){
      const [articles,people,emner,ads]=await Promise.all([getJSON('data/artikler.json'),getJSON('data/journalister.json'),getJSON('data/emneregister.json'),getJSON('reklame/manifest.json')]);
      const topics=emner.emner||[];
      if(page==='home')frontPage(articles,ads);
      if(page==='article')articlePage(articles,people,ads);
      if(page==='category')categoryPage(articles,topics);
      if(page==='archive')archivePage(articles,people);
      if(page==='journalist')journalistPage(articles,people);
    }else if(['editor','ads','about','privacy'].includes(page)){staticPage(page,page==='ads'?await getJSON('reklame/manifest.json'):[]);}
  }catch(err){console.error(err);const node=qs('#content');if(node)node.innerHTML=`<section class="paper-sheet"><h1>Kunne ikke laste innholdet</h1><p>Kontroller at nettstedet åpnes via en webserver, og at JSON-filene finnes i mappen <code>data/</code>.</p><p><a href="index.html">Til forsiden</a></p></section>`;}
}
init();
