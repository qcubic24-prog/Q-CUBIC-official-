// Content is public; this module never contains an editor credential.
fetch('./src/studio/content.json',{cache:'no-store'}).then(r=>r.json()).then(data=>{
 for(const [key,selector] of [['hero','.hero-motion'],['film','.fs-source'],['gaming','.ga-source']]){
  const source=data.backgrounds?.[key],video=document.querySelector(selector);
  if(!video||!source||!/^\.\/src\/studio\/uploads\/[a-zA-Z0-9-]+\.mp4$/.test(source))continue;
  video.dataset.src=source;video.dataset.mobileSrc=source;video.src=source;video.load();
  if(key==='hero'){video.muted=true;video.play().catch(()=>{})}
 }
}).catch(()=>{});
const nav=document.querySelector('.navigation');
if(nav){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 nav.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.hash);if(!target)return;event.preventDefault();history.pushState(null,'',link.hash);target.scrollIntoView({behavior:reduced.matches?'instant':'smooth'})}));
 const links=[...nav.querySelectorAll('a[href^="#"]')];
 const observer=new IntersectionObserver(entries=>{const current=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!current)return;links.forEach(a=>{const active=a.hash==='#'+current.target.id;a.classList.toggle('current',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-10% 0px -55% 0px',threshold:0});
 links.forEach(a=>{const section=document.querySelector(a.hash);if(section)observer.observe(section)});
}
if(['localhost','127.0.0.1'].includes(location.hostname) || location.hostname.includes('run.app')){
 const mount=()=>{const footer=document.querySelector('.qcf-bottom');if(footer&&!footer.querySelector('[data-dashboard]')){const link=document.createElement('a');link.href='./admin/';link.dataset.dashboard='';link.textContent='Dashboard ↗';link.style.cssText='margin-left:24px;text-decoration:underline';footer.append(link)}};
 if(document.readyState==='complete')mount();else addEventListener('load',mount,{once:true});
}
