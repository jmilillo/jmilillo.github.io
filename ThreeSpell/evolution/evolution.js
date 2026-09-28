(() => {
  const section = document.querySelector('.evolution-scroll');
  const root = document.documentElement;
  const stage = document.querySelector('.evolution-stage');
  const controls = [...document.querySelectorAll('.control')];
  const oldExtras = [...document.querySelectorAll('.old-extra')];
  const gameSection = document.querySelector('.game-evolution-scroll');
  const gameStage = document.querySelector('.game-evolution-stage');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  const clamp = (value) => Math.max(0, Math.min(1, value));
  const range = (progress, start, end) => clamp((progress - start) / (end - start));
  const smooth = (value) => value * value * (3 - 2 * value);
  const mix = (from, to, amount) => from + (to - from) * amount;

  function update() {
    scheduled = false;
    if (reduceMotion.matches) return;
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - innerHeight);
    const scrolled = clamp(-rect.top / travel);
    // Timings below were authored with a lead-in before the first button moves; skip it so scrolling responds at once.
    const p = mix(.15, 1, scrolled);
    root.style.setProperty('--progress', scrolled);
    const menuDevice = smooth(range(p, .66, .90));
    stage.style.setProperty('--menu-device-x', mix(.70, 1, menuDevice));
    stage.style.setProperty('--menu-device-y', mix(.66, 1, menuDevice));
    stage.style.setProperty('--menu-aspect', mix(320 / 480, 851 / 1848, menuDevice));
    stage.querySelector('.app-viewport').style.setProperty('--env', smooth(range(p, .70, .90)));
    stage.querySelector('.app-viewport').style.setProperty('--old-copy', 1 - smooth(range(p, .55, .68)));
    stage.querySelector('.app-viewport').style.setProperty('--new-copy', smooth(range(p, .60, .74)));
    stage.querySelector('.stage-label-old').style.opacity = 1 - smooth(range(p, .55, .7));
    stage.querySelector('.stage-label-new').style.opacity = smooth(range(p, .60, .75));
    const finalMessage = stage.querySelector('.final-message');
    const finalAlpha = smooth(range(p, .90, .96));
    finalMessage.style.opacity = finalAlpha;
    finalMessage.style.transform = `translateY(${mix(8, 0, finalAlpha)}px)`;
    oldExtras.forEach((item) => item.style.opacity = 1 - smooth(range(p, .42, .58)));

    controls.forEach((control) => {
      const local = smooth(range(p, Number(control.dataset.start), Number(control.dataset.end)));
      const name = [...control.classList].find((item) => item.startsWith('control-')).replace('control-', '');
      const viewport = stage.querySelector('.app-viewport');
      const targetX = Number(control.dataset.targetX) * viewport.clientWidth;
      const targetY = Number(control.dataset.targetY) * viewport.clientHeight + Number(control.dataset.targetOffsetY || 0);
      const end = [
        targetX - (control.offsetLeft + control.offsetWidth / 2),
        targetY - (control.offsetTop + control.offsetHeight / 2),
        { play: -5, bank: 4, store: -3, tutorial: 5, credits: -4 }[name]
      ];
      control.style.setProperty('--x', `${mix(0, end[0], local)}px`);
      control.style.setProperty('--y', `${mix(0, end[1], local)}px`);
      control.style.setProperty('--scale', mix(1, .94, local));
      control.style.setProperty('--rot', `${mix(0, end[2], local)}deg`);
      control.style.setProperty('--old-alpha', 1 - local);
      control.style.setProperty('--new-alpha', local);
    });

    if (gameSection && gameStage) {
      const gameRect = gameSection.getBoundingClientRect();
      const gameTravel = Math.max(1, gameSection.offsetHeight - innerHeight);
      const gameProgress = clamp(-gameRect.top / gameTravel);
      const dog = smooth(range(gameProgress, .04, .20));
      const name = smooth(range(gameProgress, .20, .34));
      const fridge = smooth(range(gameProgress, .34, .56));
      const interaction = smooth(range(gameProgress, .50, .74));
      const accessories = smooth(range(gameProgress, .76, .92));
      const device = smooth(range(gameProgress, .34, .60));
      gameStage.style.setProperty('--game-progress', gameProgress);
      gameStage.style.setProperty('--dog', dog);
      gameStage.style.setProperty('--name', name);
      gameStage.style.setProperty('--interaction', interaction);
      gameStage.style.setProperty('--fridge', fridge);
      gameStage.style.setProperty('--accessories', accessories);
      gameStage.style.setProperty('--device-x', mix(.70, 1, device));
      gameStage.style.setProperty('--device-y', mix(.66, 1, device));
      gameStage.style.setProperty('--game-aspect', mix(320 / 480, 851 / 1848, device));
      gameStage.querySelector('.game-stage-label-old').style.opacity = 1 - smooth(range(gameProgress, .55, .76));
      gameStage.querySelector('.game-stage-label-new').style.opacity = smooth(range(gameProgress, .62, .82));
    }
  }
  function requestUpdate() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }

  // Dragging a timeline scrubs its section by scrolling the page to the matching point.
  function makeScrubbable(track, scrollSection) {
    if (!track || !scrollSection) return;
    const seek = (event) => {
      const bar = track.getBoundingClientRect();
      const fraction = clamp((event.clientX - bar.left) / bar.width);
      const sectionTop = scrollSection.getBoundingClientRect().top + scrollY;
      const travel = Math.max(1, scrollSection.offsetHeight - innerHeight);
      scrollTo({ top: sectionTop + fraction * travel, behavior: 'instant' });
    };
    track.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      track.setPointerCapture(event.pointerId);
      track.classList.add('scrubbing');
      seek(event);
    });
    track.addEventListener('pointermove', (event) => { if (track.hasPointerCapture(event.pointerId)) seek(event); });
    const stop = () => track.classList.remove('scrubbing');
    track.addEventListener('pointerup', stop);
    track.addEventListener('pointercancel', stop);
  }
  makeScrubbable(document.querySelector('.timeline i'), section);
  makeScrubbable(document.querySelector('.game-timeline i'), gameSection);

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  reduceMotion.addEventListener('change', requestUpdate);
  requestUpdate();
})();
