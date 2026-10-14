import {GamingStudio} from './components/GamingStudio.js';
import {initGamingScroll} from './animations/gamingScroll.js';
import {Hero} from './components/Hero.js';
import {initHeroAnimations} from './animations/heroAnimations.js';
import {DigitalStudio,CreativeStudio,initStudio} from './studio/studio.js';

import {FilmStudio} from './components/FilmStudio.js';
import {initFilmScroll} from './animations/filmScroll.js';
document.querySelector('#app').innerHTML=Hero()+DigitalStudio()+FilmStudio()+GamingStudio()+CreativeStudio();
initHeroAnimations(document.querySelector('.hero'));
initStudio();
initFilmScroll(document.querySelector('.fs-chapter'));

if(location.hash==='#web-development')requestAnimationFrame(()=>document.querySelector('#web-development').scrollIntoView({block:'start'}));
if(location.hash==='#ai-filmmaking'){
 const enterFilm=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelector('#ai-filmmaking').scrollIntoView({block:'start',behavior:'instant'})));
 if(document.readyState==='complete')enterFilm();else addEventListener('load',enterFilm,{once:true});
}

initGamingScroll(document.querySelector('.ga-studio'));
if(location.hash==='#gaming-animation'){const enter=()=>requestAnimationFrame(()=>document.querySelector('#gaming-animation').scrollIntoView({block:'start',behavior:'instant'}));if(document.readyState==='complete')enter();else addEventListener('load',enter,{once:true});}
