export function introCard() {
  return `<div class="qc-intro-wrap"><button class="qc-intro-card" aria-haspopup="dialog" aria-controls="qc-intro-dialog" aria-label="Watch the Q-Cubic introduction"><span class="qc-intro-picture"><video muted loop playsinline preload="metadata" src="/src/assets/introduction/q-cubic-introduction.mp4" poster="/src/assets/introduction/poster.jpg" aria-hidden="true" tabindex="-1"></video><span class="qc-intro-play" aria-hidden="true">▶</span><span class="qc-intro-duration">1:57</span></span><span class="qc-intro-caption"><span><small>MEET Q-CUBIC</small><strong>A little introduction.</strong></span><span aria-hidden="true">↗</span></span></button></div><dialog id="qc-intro-dialog" class="qc-intro-dialog" aria-labelledby="qc-intro-title"><header><h2 id="qc-intro-title">Introducing Q-Cubic</h2><button class="qc-intro-close" aria-label="Close introduction video">Close ×</button></header><video controls playsinline preload="metadata" poster="/src/assets/introduction/poster.jpg" src="/src/assets/introduction/q-cubic-introduction.mp4"></video><p class="qc-intro-status" role="status"></p></dialog>`;
}

export function initIntro() {
  const card = document.querySelector('.qc-intro-card');
  const dialog = document.querySelector('#qc-intro-dialog');
  if (!card || !dialog || card.dataset.ready) return;
  card.dataset.ready = 'true';

  const preview = card.querySelector('video');
  const player = dialog.querySelector('video');
  const status = dialog.querySelector('[role="status"]');
  let near = false;
  let previousOverflow = '';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  if (preview && !preview.getAttribute('src')) {
    preview.src = '/src/assets/introduction/q-cubic-introduction.mp4';
  }

  function sync() {
    if (near && !document.hidden && !dialog.open && !reduced.matches) {
      if (preview) {
        if (!preview.src || !preview.src.includes('q-cubic-introduction.mp4')) {
          preview.src = '/src/assets/introduction/q-cubic-introduction.mp4';
        }
        preview.play().catch(() => {});
      }
    } else {
      if (preview) preview.pause();
    }
  }

  new IntersectionObserver(([e]) => {
    near = e.isIntersecting;
    sync();
  }, { threshold: 0.1 }).observe(card);

  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);

  card.addEventListener('click', () => {
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    if (preview) preview.pause();
    if (status) status.textContent = '';
    if (player) {
      if (!player.src || !player.src.includes('q-cubic-introduction.mp4')) {
        player.src = '/src/assets/introduction/q-cubic-introduction.mp4';
      }
      player.play().catch(() => {
        if (status) status.textContent = 'Press play to watch the introduction.';
      });
    }
  });

  const closeBtn = dialog.querySelector('.qc-intro-close');
  if (closeBtn) {
    closeBtn.onclick = () => dialog.close();
  }

  dialog.addEventListener('close', () => {
    if (player) player.pause();
    document.body.style.overflow = previousOverflow;
    card.focus({ preventScroll: true });
    sync();
  });

  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
      dialog.close();
    }
  });

  if (player) {
    player.addEventListener('error', () => {
      if (status) status.textContent = 'The video could not load. Please refresh and try again.';
    });
  }
}
