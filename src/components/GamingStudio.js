const captions=[
 ['GAMING &<br>ANIMATION','Creating characters, worlds and experiences that move.'],
 ['ANIMATION.','Bringing every movement to life.'],
 ['GAME WORLDS.','Building immersive worlds designed to be explored.'],
 ['ACTION.','Movement designed for impact.'],
 ['CINEMATICS.','Turning gameplay into cinematic storytelling.'],
 ['VFX.','Visual effects that make digital worlds feel alive.'],
 ['FROM IDEA<br>TO WORLD.','Characters, animation, environments and interactive experiences — built by Q-Cubic.']
];
export function GamingStudio(){return `<section class="ga-studio" id="gaming-animation" aria-label="Gaming & Animation"><div class="ga-timeline"><div class="ga-pin"><canvas class="ga-screen" aria-hidden="true"></canvas><video class="ga-source" data-src="./src/assets/gaming/action-motion.mp4" muted playsinline preload="none" aria-hidden="true" tabindex="-1"></video><div class="ga-shade" aria-hidden="true"></div><div class="ga-editorial">${captions.map((c,i)=>`<article class="ga-copy ${i===0?'ga-current':''}" data-ga-copy="${i}" aria-hidden="${i!==0}"><p class="ga-label">Q-CUBIC / GAMING & ANIMATION</p><${i?'h3':'h2'}>${c[0].split('<br>').map(line=>`<span><b>${line}</b></span>`).join('')}</${i?'h3':'h2'}><p class="ga-support">${c[1]}</p></article>`).join('')}</div><div class="ga-controls"><span>SCROLL TO CONTINUE ↓</span><button class="ga-skip">Skip sequence ↗</button></div><div class="ga-progress" aria-hidden="true"><i></i></div><p class="ga-status" role="status"></p></div></div><div class="ga-release"><span>Q-CUBIC / GAMING & ANIMATION</span><button class="ga-replay">Replay sequence ↗</button></div></section>`}
