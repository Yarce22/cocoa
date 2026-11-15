(() => {
  // Content comes from Sanity, emitted by the page as JSON (see src/pages/reposteria.astro).
  const DATA = JSON.parse(document.getElementById('gallery-data')?.textContent || '{}');
  // shape: t1/t2/t3 = tile height, r = arched top
  const ITEMS = DATA.items || [];
  const FILTERS = DATA.filters || [['todo', '']];
  const [ONE, MANY] = DATA.contador || ['creación', 'creaciones'];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  const $ = (s) => document.querySelector(s);
  const pills = $('.pills'), grid = $('.masonry'), count = $('.count'), lb = $('.lb');
  let filter = 'todo', list = ITEMS, open = 0;

  const render = () => {
    list = ITEMS.filter((x) => filter === 'todo' || x.cat === filter);
    pills.innerHTML = FILTERS.map(([id, label]) => `<button type="button" class="pill" data-f="${esc(id)}" aria-pressed="${filter === id}">${esc(label)}</button>`).join('');
    count.textContent = `${list.length} ${list.length === 1 ? ONE : MANY}`;
    grid.innerHTML = list.map((x, i) => `<button type="button" class="tile" style="--n:${i}" data-i="${i}" aria-label="Ver ${esc(x.name)}">
<div class="ph ${esc(x.shape)}"><img src="${esc(x.src)}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}"></div>
<div class="tmeta"><b>${esc(x.name)}</b><small>${esc(x.catName)}</small></div></button>`).join('');
  };

  const show = (i) => {
    open = (i + list.length) % list.length;
    const x = list[open];
    $('#lb-img').src = x.full;
    $('#lb-img').alt = x.alt || x.name;
    $('#lb-cat').textContent = x.catName;
    $('#lb-name').textContent = x.name;
    $('#lb-desc').textContent = x.desc;
    $('#lb-detail').textContent = x.detail;
    if (!lb.open) lb.showModal();
  };

  pills.addEventListener('click', (e) => {
    const f = e.target.closest('[data-f]')?.dataset.f;
    if (f) { filter = f; render(); [...pills.querySelectorAll('[data-f]')].find((b) => b.dataset.f === f)?.focus(); }
  });
  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (tile && list.length) show(+tile.dataset.i);
  });
  lb.addEventListener('click', (e) => {
    const act = e.target.closest('[data-lb]')?.dataset.lb;
    if (act === 'close' || e.target === lb) lb.close(); // e.target === lb means the backdrop
    else if (act && list.length) show(open + (act === 'next' ? 1 : -1));
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(open + 1);
    if (e.key === 'ArrowLeft') show(open - 1);
  });

  render();
})();
