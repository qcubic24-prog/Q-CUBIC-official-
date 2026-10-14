const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export function initGamingScroll(section){
 const timeline=section.querySelector('.ga-timeline'),pin=section.querySelector('.ga-pin'),video=section.querySelector('.ga-source'),canvas=section.querySelector('.ga-screen'),ctx=canvas.getContext('2d',{alpha:false});
 const copies=[...section.querySelectorAll('.ga-copy')],bar=section.querySelector('.ga-progress i'),status=section.querySelector('.ga-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let loaded=false,near=false,frame=0,last=0,p=0,targetTime=0,start=0,travel=1,width=1,height=1;
 const poster=new Image();poster.src='./src/assets/gaming/action-poster.webp';poster.onload=()=>draw();
 function draw(){
  if(!ctx)return;const w=canvas.width,h=canvas.height,source=video.readyState>=2?video:poster;
  if(!source||source===poster&&!poster.complete)return;
  const sw=source===video?video.videoWidth:poster.naturalWidth,sh=source===video?video.videoHeight:poster.naturalHeight;
  if(!sw||!sh)return;
  ctx.fillStyle='#0d1414';ctx.fillRect(0,0,w,h);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const artHeight=width<700?h*.68:h,scale=Math.max(w/sw,artHeight/sh),dw=sw*scale,dh=sh*scale;
  ctx.drawImage(source,0,0,sw,sh,(w-dw)/2,(artHeight-dh)*.35,dw,dh);
  if(source===video){section.dataset.media='ready';section.dataset.mediaTime=video.currentTime.toFixed(3)}
 }
 function seek(){
  if(video.readyState<2||video.seeking||!Number.isFinite(video.duration))return;
  const time=Math.round(Math.min(Math.max(0,targetTime),video.duration-1/24)*24)/24;
  if(Math.abs(video.currentTime-time)>1/48)video.currentTime=time;else draw();
 }
 function load(){if(loaded)return;loaded=true;video.src=video.dataset.src;video.preload='auto';video.load()}
 video.addEventListener('loadeddata',()=>{seek();draw()});video.addEventListener('seeked',()=>{draw();schedule()});
 video.addEventListener('error',()=>{status.textContent='The video could not load. Please reload to try again.';section.dataset.media='error'});
 function render(now){frame=0;const desired=clamp((scrollY-start)/travel),dt=last?Math.min(now-last,50):16;last=now;
  p=reduced.matches?desired:p+(desired-p)*(1-Math.exp(-dt/140));if(Math.abs(desired-p)<.00002)p=desired;
  const t=Math.min(6.9999,p*7),i=Math.floor(t),f=t-i;
  copies.forEach((copy,j)=>{const visible=i===j;copy.classList.toggle('ga-current',visible);copy.setAttribute('aria-hidden',String(!visible));if(!visible)return;const incoming=i===0?1:ease(f/.18),outgoing=i===6?0:ease((f-.80)/.20);copy.style.transform=reduced.matches?'none':`translate3d(${outgoing*-5}%,${(1-incoming)*28-outgoing*24}px,0)`;copy.querySelectorAll('b').forEach((line,k)=>{line.style.transform=reduced.matches?'none':`translateY(${(1-ease((f-k*.025)/.18))*(i===0?0:112)-outgoing*112}%)`});copy.querySelector('.ga-support').style.transform=reduced.matches?'none':`translateX(${(1-incoming)*35-outgoing*45}px)`});
  section.dataset.scene=String(i+1);section.dataset.progress=p.toFixed(4);bar.style.transform=`scaleX(${p})`;
  targetTime=p*(Number.isFinite(video.duration)?video.duration-1/24:7.3333);
  if(loaded)seek();
  if(near&&Math.abs(p-desired)>.00002)schedule();
 }
 function schedule(){if(!frame&&!document.hidden&&near)frame=requestAnimationFrame(render)}
 function measure(){width=pin.clientWidth;height=pin.clientHeight;const ratio=Math.min(devicePixelRatio||1,2,1920/width);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);start=timeline.getBoundingClientRect().top+scrollY;travel=Math.max(1,timeline.offsetHeight-height);last=0;draw();schedule()}
 reduced.addEventListener('change',schedule);
 section.querySelector('.ga-skip').addEventListener('click',()=>section.querySelector('.ga-release').scrollIntoView({behavior:reduced.matches?'instant':'smooth'}));
 section.querySelector('.ga-replay').addEventListener('click',()=>scrollTo({top:start,behavior:reduced.matches?'instant':'smooth'}));
 new IntersectionObserver(([entry])=>{near=entry.isIntersecting;if(near){load();last=0;schedule()}else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'1000px'}).observe(timeline);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});new ResizeObserver(measure).observe(timeline);document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});measure();
}
