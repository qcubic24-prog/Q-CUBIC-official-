// Native cloud footage keeps the background continuous without warping the artwork.
export function initHeroAnimations(hero){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(pointer:fine)');
 const title=hero.querySelector('h1');
 const video=hero.querySelector('.hero-motion');
 let running=true,inView=true,raf=0,last=0,time=0,mx=0,my=0,px=0,py=0;
 video.muted=true;
 function syncVideo(){
  if(running&&inView&&!document.hidden)video.play().catch(()=>{});
  else video.pause();
 }
 video.addEventListener('loadeddata',()=>{hero.classList.add('video-ready');syncVideo()});
 video.addEventListener('error',()=>hero.classList.remove('video-ready'));
 if(video.readyState>=2)hero.classList.add('video-ready');
 hero.classList.add('is-loading');
 Promise.allSettled([...hero.querySelectorAll('img')].map(img=>img.decode())).then(()=>{
  hero.classList.remove('is-loading');hero.classList.add('is-ready');
 });
 function draw(stamp){
  const dt=last?Math.min((stamp-last)/1000,.05):0;last=stamp;
  if(running){time+=dt;px+=(mx-px)*Math.min(1,dt*2);py+=(my-py)*Math.min(1,dt*2);}
  title.style.transform=`translate3d(${px*1.5+Math.sin(time*.06)*.7}px,${py+Math.sin(time*.04)*.7}px,0)`;
  hero.dataset.motion=running?'playing':'paused';
  if(running&&inView&&!document.hidden)raf=requestAnimationFrame(draw);
 }
 function schedule(){cancelAnimationFrame(raf);last=0;draw(performance.now());}
 function sync(){syncVideo();schedule()}
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;syncVideo();schedule()},{threshold:0}).observe(hero);
 hero.addEventListener('pointermove',e=>{if(!fine.matches||!running)return;const r=hero.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5});
 hero.addEventListener('pointerleave',()=>{mx=0;my=0});
 reduced.addEventListener('change',()=>{running=true;mx=my=px=py=0;sync()});
 document.addEventListener('visibilitychange',()=>{syncVideo();schedule()});
 sync();
}
