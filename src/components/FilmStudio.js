export const filmChapters = [
  {name:'Concept',short:'Idea',title:['From an idea.'],description:'A spark. A direction. A world waiting to happen.',services:'Concept development · Visual development · Creative direction'},
  {name:'Story',short:'Story',title:['Give it','a story.'],description:'Shape the moments that make people feel something.',services:'Story development · Script assistance · Storyboarding'},
  {name:'Characters',short:'Cast',title:['A character.','An identity.'],description:'Distinctive faces. Consistent identities. Stories with someone at their heart.',services:'AI character design · Digital avatars · Character consistency'},
  {name:'Worlds',short:'World',title:['Build the','impossible.'],description:'From familiar places to worlds that only exist in your imagination.',services:'Cinematic locations · Fantasy & future worlds · Historical environments'},
  {name:'Cinematics',short:'Motion',title:['Made','to move.'],description:'Camera, character and atmosphere. Every movement serves the story.',services:'AI video production · Cinematic sequences · Brand & product films'},
  {name:'VFX',short:'VFX',title:['Beyond','the possible.'],description:'Extend the scene. Shape the atmosphere. Bring every layer together.',services:'AI VFX · Scene extensions · Cleanup · Compositing'},
  {name:'Final film',short:'Film',title:['Imagination.','Into film.'],description:'One creative vision, carried from the first idea to the final frame.',services:'Short films · Promotional & social films · Cinematic finishing'}
];

export function FilmStudio(){return `<section class="fs-chapter" id="ai-filmmaking" aria-labelledby="fs-title">
  <div class="fs-sequence">
    <div class="fs-pin">
      <div class="fs-picture" aria-hidden="true">
        <img class="fs-poster" src="./src/assets/film/studio-poster.webp" alt="" loading="lazy" decoding="async">
        <canvas class="fs-screen"></canvas>
        <div class="fs-light"></div><div class="fs-vignette"></div>
        <div class="fs-shutter fs-shutter-left"></div><div class="fs-shutter fs-shutter-right"></div>
      </div>
      <video class="fs-source" data-src="./src/assets/film/studio-motion-hq.mp4" data-mobile-src="./src/assets/film/studio-motion-mobile.mp4" muted playsinline preload="none" tabindex="-1" aria-hidden="true"></video>
      <header class="fs-header"><a class="fs-brand" href="#web-development" aria-label="Back to Web Development">Q-Cubic <span>/ Film Studio</span></a><span class="fs-edition">CREATIVE PRODUCTION — 03</span></header>
      <div class="fs-opening">
        <span class="fs-eyebrow">AI-POWERED CREATIVE PRODUCTION</span>
        <h2 id="fs-title">Stories,<br><em>reimagined.</em></h2>
        <div class="fs-opening-bottom"><span>AI FILMMAKING</span><p>From concept and characters to cinematic worlds, motion, VFX and final film.</p><button class="fs-enter">Scroll to enter <span>↓</span></button></div>
      </div>
      <div class="fs-captions">${filmChapters.map((c,i)=>`<article class="fs-copy" data-film-copy="${i}" aria-hidden="true"><span class="fs-eyebrow">${String(i+1).padStart(2,'0')} / ${c.name.toUpperCase()}</span><h3>${c.title.map(line=>`<span><b>${line}</b></span>`).join('')}</h3><div class="fs-description"><p>${c.description}</p><small>${c.services}</small></div></article>`).join('')}</div>
      <div class="fs-timecode" aria-hidden="true"><span>Q / FILM</span><span class="fs-time">00:00:00</span></div>
      <div class="fs-footer"><nav class="fs-chapters" aria-label="Filmmaking chapters">${filmChapters.map((c,i)=>`<button data-film-scene="${i}" aria-label="${i+1}. ${c.name}"><i><u></u></i><span class="fs-nav-full">${c.name}</span><span class="fs-nav-short">${c.short}</span><small>${String(i+1).padStart(2,'0')}</small></button>`).join('')}</nav><div class="fs-footer-meta"><span class="fs-scroll-note">SCROLL TO DIRECT THE STORY</span><button class="fs-skip">Skip sequence ↗</button></div></div>
      <p class="fs-status" role="status"></p>
    </div>
  </div>
  <div class="fs-end" id="film-finale"><span class="fs-eyebrow">Q-CUBIC / AI FILM STUDIO</span><p>From imagination<br>to cinematic reality.</p><button class="fs-replay">Experience it again <span>↗</span></button></div>
</section>`}

