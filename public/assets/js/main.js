(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav, mobile menu, floating button ---- */
  const nav = $('.nav'), burger = $('.burger'), menu = $('.mmenu'), fab = $('.fab');
  const here = location.pathname.replace(/\/$/, '') || '/';
  $$('.nl, .ml').forEach((a) => a.getAttribute('href') === here && a.setAttribute('aria-current', 'page'));

  const setMenu = (open) => {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.inert = !open;
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  matchMedia('(min-width:900px)').addEventListener('change', () => setMenu(false));

  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > last && y > 480);
    fab.classList.toggle('show', y > innerHeight * 0.6);
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- hero dust ---- */
  const specks = $('.specks');
  if (specks && !reduce) {
    const r = Math.random;
    specks.innerHTML = Array.from({ length: 16 }, () => {
      const s = 2 + r() * 4;
      return `<i style="left:${r() * 100}%;width:${s}px;height:${s}px;--o:${(0.25 + r() * 0.5).toFixed(2)};--dx:${Math.round(r() * 120 - 60)}px;animation-duration:${9 + r() * 10}s;animation-delay:${-r() * 18}s"></i>`;
    }).join('');
  }

  /* ---- dessert rail progress (touch scroll) ---- */
  const box = $('.strip-box'), bar = $('.rail i');
  if (box && bar) {
    box.addEventListener('scroll', () => {
      const max = box.scrollWidth - box.clientWidth;
      bar.style.transform = `scaleX(${Math.max(0.12, max ? box.scrollLeft / max : 1)})`;
    }, { passive: true });
  }

  // The long intro plays once per session; later visits use the short one.
  try { sessionStorage.cocoaSeen = 1; } catch {}

  /* ---- scroll motion: nothing is hidden unless GSAP is actually running ---- */
  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  const once = (trigger, start = 'top 86%') => ({ trigger, start, once: true });

  // Page heads animate with CSS (no flash while GSAP downloads), so they are skipped here.
  const below = (sel) => $$(sel).filter((el) => !el.closest('.page-head'));

  const rv = below('.rv');
  rv.forEach((el) => gsap.set(el, { autoAlpha: 0, y: el.matches('.btn') ? 0 : 44 }));
  ScrollTrigger.batch(rv, {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.09 }),
  });

  // Break a paragraph into its real rendered lines so each one can rise from its own mask.
  const split = (el) => {
    const words = [...el.childNodes].flatMap((node) => node.textContent.split(/\s+/).filter(Boolean).map((text) => {
      const word = node.nodeType === 1 ? node.cloneNode(false) : document.createElement('span');
      word.textContent = text;
      return word;
    }));
    el.replaceChildren(...words.flatMap((w) => [w, ' ']));
    const rows = new Map();
    words.forEach((w) => rows.set(w.offsetTop, [...(rows.get(w.offsetTop) || []), w]));
    el.replaceChildren(...[...rows.values()].map((row) => {
      const line = document.createElement('span'), inner = document.createElement('span');
      line.className = 'ln';
      inner.append(...row.flatMap((w) => [w, ' ']));
      line.append(inner);
      return line;
    }));
    el.classList.add('lines');
  };

  // Line breaks depend on the web font, so measure only once it is in.
  document.fonts.ready.then(() => {
    $$('[data-split]').forEach(split);
    below('.lines').forEach((group) => {
      const lines = $$('.ln > span', group);
      gsap.set(lines, { yPercent: 118, rotate: 3, transformOrigin: '0 100%' });
      ScrollTrigger.create({ ...once(group), onEnter: () => gsap.to(lines, { yPercent: 0, rotate: 0, duration: 1.15, ease: 'power4.out', stagger: 0.12 }) });
    });
  });

  below('.unmask').forEach((el) => gsap.fromTo(el,
    { clipPath: 'ellipse(45% 0% at 50% 100%)' },
    { clipPath: 'ellipse(130% 150% at 50% 100%)', duration: 1.5, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: once(el) }));

  $$('.zoom').forEach((el) => gsap.from(el, { scale: 1.3, duration: 1.9, ease: 'power3.out', scrollTrigger: once(el) }));
  $$('.px').forEach((el) => gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } }));
  $$('.hat-draw').forEach((el) => gsap.from(el, { strokeDashoffset: 1, duration: 1.8, ease: 'power2.inOut', scrollTrigger: once(el, 'top 90%') }));

  if ($('.hero')) {
    gsap.to('.hero-media', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-in', { y: -80, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '65% top', scrub: true } });
  }

  // Stacked service cards: each one shrinks back as the next slides over it.
  const cards = $$('.card');
  cards.slice(0, -1).forEach((card, i) => gsap.to(card, { scale: 0.93, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } }));

  if ($('.track')) {
    gsap.from('.dcard', { y: 60, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, scrollTrigger: once('.strip-box') });
    gsap.matchMedia().add('(min-width:900px)', () => {
      const track = $('.track');
      gsap.to(track, { x: () => Math.min(0, innerWidth - track.scrollWidth), ease: 'none', scrollTrigger: { trigger: '.strip', start: 'top 70%', end: 'bottom 30%', scrub: 0.5, invalidateOnRefresh: true } });
    });
  }

  if ($('.pageline')) gsap.fromTo('.pageline path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.linewrap', start: 'top 60%', end: 'bottom 60%', scrub: true } });
  if ($('.cta-bg')) gsap.fromTo('.cta-bg', { clipPath: 'circle(6% at 50% 72%)' }, { clipPath: 'circle(85% at 50% 50%)', ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 92%', end: 'top 25%', scrub: true } });

  $$('[data-scrub]').forEach((el) => {
    const x = el.dataset.scrub === 'x';
    gsap.from(el, { [x ? 'scaleX' : 'scaleY']: 0, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: x ? 'top 80%' : 'top 60%', end: x ? 'top 35%' : 'bottom 60%', scrub: true } });
  });
  $$('.dot').forEach((el) => gsap.from(el, { scale: 0.2, autoAlpha: 0.2, duration: 0.7, ease: 'back.out(2.5)', scrollTrigger: once(el, 'top 62%') }));

  gsap.fromTo('.ft-word', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: '.ft-word', start: 'top bottom', end: 'bottom bottom', scrub: true } });
})();
