const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)};

export function initFilmScroll(section){
 const sequence=section.querySelector('.fs-sequence'),pin=section.querySelector('.fs-pin'),video=section.querySelector('.fs-source'),canvas=section.querySelector('.fs-screen'),context=canvas.getContext('2d',{alpha:false});
 const picture=section.querySelector('.fs-picture'),opening=section.querySelector('.fs-opening'),copies=[...section.querySelectorAll('.fs-copy')],buttons=[...section.querySelectorAll('[data-film-scene]')],bars=buttons.map(b=>b.querySelector('u')),timecode=section.querySelector('.fs-time'),footer=section.querySelector('.fs-footer'),left=section.querySelector('.fs-shutter-left'),right=section.querySelector('.fs-shutter-right'),status=section.querySelector('.fs-status');
 const systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let reduced=false,start=0,travel=1,width=1,height=1,p=0,t=-1,frame=0,target=.55,loaded=false,active=-1,lastTick=0;
 // The browser decodes only the latest requested frame. Scroll events never queue seeks.
 function seek(){if(video.readyState<2||video.seeking||!Number.isFinite(video.duration))return;const next=clamp(Math.round((reduced?.55:target)*60)/60,0,video.duration-.02);if(Math.abs(video.currentTime-next)>.007)video.currentTime=next;else draw()}
 function draw(){if(!context||video.readyState<2)return;const w=canvas.width,h=canvas.height,mobile=width<=600,portrait=width/height<1,artHeight=h*(mobile?.55:portrait?.70:.80);
  context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
  context.fillStyle='#0d1414';context.fillRect(0,0,w,h);
  const aspect=w/artHeight,sourceAspect=video.videoWidth/video.videoHeight;
  let sw=video.videoWidth,sh=video.videoHeight;if(sourceAspect>aspect)sw=sh*aspect;else sh=sw/aspect;
  const shotTime=video.currentTime;
  const focus=mobile?.51+.17*ease(1.4,2.8,shotTime)*(1-ease(3.5,4.1,shotTime))+.13*ease(6.5,7.8,shotTime):.50;
  const sx=(video.videoWidth-sw)*focus,sy=(video.videoHeight-sh)*.45;
  context.drawImage(video,sx,sy,sw,sh,0,0,w,artHeight);
  // Offset two strips during a cut, echoing the reference's split-frame editing.
  const f=t-Math.floor(t),cut=t>=0&&t<6.95?Math.sin(clamp((f-.80)/.20)*Math.PI):0;
  if(!reduced&&cut>.005){for(const [x,dir] of [[0,-1],[.70,1]]){context.save();context.beginPath();context.rect(w*x,0,w*.30,artHeight);context.clip();context.drawImage(video,sx,sy,sw,sh,dir*cut*w*.018,dir*cut*artHeight*.09,w,artHeight);context.restore()}}
  const blend=context.createLinearGradient(0,artHeight*.76,0,artHeight);blend.addColorStop(0,'#0d141400');blend.addColorStop(1,'#0d1414');context.fillStyle=blend;context.fillRect(0,artHeight*.76,w,artHeight*.24+1);
  section.dataset.media='ready';section.dataset.mediaTime=video.currentTime.toFixed(3);
 }
 function load(){if(loaded)return;loaded=true;video.src=width<=700||navigator.connection?.saveData?video.dataset.mobileSrc:video.dataset.src;video.preload='auto';video.load()}
 video.addEventListener('loadeddata',()=>{seek();draw()});video.addEventListener('seeked',()=>{draw();seek()});video.addEventListener('error',()=>{section.dataset.media='error';status.textContent='Motion is unavailable. You can still explore every chapter.'});
 new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))load()},{rootMargin:'1400px'}).observe(section);
 function render(now){frame=0;const desired=clamp((scrollY-start)/travel),dt=lastTick?Math.min(50,now-lastTick):16;lastTick=now;
  // A short time-based catch-up removes wheel-step judder without intercepting scrolling.
  if(reduced||desired===0||desired===1)p=desired;else p+=(desired-p)*(1-Math.exp(-dt/85));
  if(Math.abs(desired-p)<.000015)p=desired;else schedule();
  t=(p-.12)/.78*7;const nearest=clamp(Math.floor(t),0,6),f=clamp(t-nearest);section.dataset.progress=p.toFixed(4);section.dataset.targetProgress=desired.toFixed(4);section.dataset.active=String(nearest);section.dataset.settled=Math.abs(t-(nearest+.35))<.035?String(nearest):'';
  const open=ease(0,.115,p),close=ease(.94,1,p);picture.style.clipPath=reduced?'inset(0)':`inset(${(1-open)*12+close*50}% ${(1-open)*14}%)`;
  picture.style.transform=reduced?'none':`scale(${1+(1-open)*.07})`;
  const openingOpacity=1-ease(.065,.13,p);opening.style.opacity=String(openingOpacity);opening.style.visibility=openingOpacity>.001?'visible':'hidden';opening.setAttribute('aria-hidden',String(openingOpacity<.5));opening.style.transform=reduced?'none':`translate3d(0,${-open*35}px,0)`;
  copies.forEach((copy,i)=>{const local=t-i,on=i===nearest&&t>=0&&t<7.35;copy.style.visibility=on?'visible':'hidden';copy.setAttribute('aria-hidden',String(!on));if(!on)return;const enter=ease(0,.20,local),leave=ease(.79,1,local),alpha=i===6?enter*(1-ease(.93,.99,p)):enter*(1-leave);copy.style.opacity=String(reduced?1:alpha);copy.style.transform=reduced?'none':`translate3d(${leave*-24}px,${(1-enter)*40-leave*32}px,0)`;copy.querySelectorAll('h3 b').forEach((line,j)=>{line.style.transform=reduced?'none':`translateY(${(1-ease(.025*j,.2+.025*j,local))*110-leave*105}%)`})});
  if(active!==nearest){active=nearest;buttons.forEach((button,i)=>{if(i===nearest&&t>=0)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')})}
  // Set current state again on crossing the introduction, where index remains zero.
  if(t>=0)buttons[nearest].setAttribute('aria-current','step');else buttons[0].removeAttribute('aria-current');
  bars.forEach((bar,i)=>bar.style.transform=`scaleX(${clamp(t-i)})`);
  footer.style.opacity=String(1-ease(.96,1,p));footer.style.visibility=p>=.999?'hidden':'visible';
  const cut=t>=0&&t<6.95?Math.sin(clamp((f-.8)/.2)*Math.PI):0;
  left.style.transform=`translateX(${-102+cut*15}%)`;right.style.transform=`translateX(${102-cut*15}%)`;
  target=.55+clamp((p-.06)/.88)*Math.max(0,(Number.isFinite(video.duration)?video.duration:7.9)-.61);
  const seconds=Math.floor(target),frames=Math.floor((target-seconds)*60);timecode.textContent=`00:${String(seconds).padStart(2,'0')}:${String(frames).padStart(2,'0')}`;
  if((scrollY>start-height*2&&scrollY<start+travel+height)&&!loaded)load();
  if(loaded){seek();draw()}
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render)}
 function measure(){width=pin.clientWidth;height=pin.clientHeight;const dpr=Math.min(devicePixelRatio||1,2,1920/width);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);start=sequence.getBoundingClientRect().top+scrollY;travel=Math.max(1,sequence.offsetHeight-height);p=clamp((scrollY-start)/travel);lastTick=0;schedule()}
 function go(i){const pos=.12+(i+.35)/7*.78;scrollTo({top:start+travel*pos,behavior:reduced?'instant':'smooth'})}
 buttons.forEach((button,i)=>{button.addEventListener('click',()=>go(i));button.addEventListener('keydown',event=>{let j=i;if(event.key==='ArrowRight')j=Math.min(6,i+1);else if(event.key==='ArrowLeft')j=Math.max(0,i-1);else if(event.key==='Home')j=0;else if(event.key==='End')j=6;else return;event.preventDefault();buttons[j].focus({preventScroll:true});go(j)})});
 section.querySelector('.fs-enter').addEventListener('click',()=>go(0));section.querySelector('.fs-skip').addEventListener('click',()=>section.querySelector('.fs-end').scrollIntoView({behavior:reduced?'instant':'smooth'}));section.querySelector('.fs-replay').addEventListener('click',()=>scrollTo({top:start,behavior:reduced?'instant':'smooth'}));
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});new ResizeObserver(measure).observe(sequence);measure();
}

