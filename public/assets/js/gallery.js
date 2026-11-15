(() => {
  const img = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
  const CATS = { tortas: 'Tortas', individuales: 'Postres individuales', galletas: 'Galletas', mesas: 'Mesas de dulces', personalizados: 'Personalizados' };
  // shape: t1/t2/t3 = tile height, r = arched top
  const ITEMS = [
    { cat: 'tortas', shape: 't3 r', id: '1606890737304-57a1ca8a5b62', name: 'Torta de chocolate y arequipe', desc: 'Bizcocho húmedo de cacao colombiano, capas de arequipe casero y ganache de chocolate al 60 %.', detail: 'Desde 12 porciones · Pedido con 3 días de anticipación' },
    { cat: 'individuales', shape: 't1', id: '1774988867972-98caecc776d8', name: 'Cheesecake de maracuyá', desc: 'Base de galleta de mantequilla, crema de queso suave y cubierta de maracuyá fresco.', detail: 'Vasitos o porciones individuales · Mínimo 12 unidades' },
    { cat: 'galletas', shape: 't2', id: '1499636136210-6f4ee915583e', name: 'Galletas de mantequilla con chips', desc: 'Bordes crocantes, centro suave y trozos generosos de chocolate semiamargo.', detail: 'Cajas de 6, 12 o 24 · Ideales para regalo' },
    { cat: 'mesas', shape: 't2', id: '1774660811156-af780020091c', name: 'Mesa de dulces · tonos tierra', desc: 'Mesa para baby shower con macarons, mini tartas, galletas decoradas y torta central en tonos crema.', detail: 'Diseño, montaje y rotulación incluidos' },
    { cat: 'personalizados', shape: 't3', id: '1761671613315-53157f91d0f8', name: 'Torta de bodas de tres pisos', desc: 'Crema de mantequilla suiza, bizcocho de vainilla y frutos rojos, decorada con flores naturales.', detail: 'Incluye degustación previa · Pedido con 3 semanas' },
    { cat: 'individuales', shape: 't2 r', id: '1620980776848-84ac10194945', name: 'Tartaletas de frutos rojos', desc: 'Masa sablé, crema pastelera de vainilla y fresas, moras y arándanos frescos.', detail: 'Mínimo 12 unidades · Perfectas para mesas de postres' },
    { cat: 'tortas', shape: 't1', id: '1702925614886-50ad13c88d3f', name: 'Torta tres leches', desc: 'Bizcocho esponjoso bañado en tres leches, merengue tostado y un toque de canela.', detail: 'Desde 10 porciones' },
    { cat: 'galletas', shape: 't1', id: '1558024920-b41e1887dc32', name: 'Alfajores de maicena', desc: 'Tapas que se deshacen en la boca, rellenas de arequipe y bordeadas con coco.', detail: 'Cajas de 12 o 24' },
    { cat: 'personalizados', shape: 't2', id: '1782852232674-64bc7f102866', name: 'Galletas decoradas con logo', desc: 'Galletas de vainilla con glaseado real y el logo o las iniciales que quieras.', detail: 'Mínimo 24 unidades · Empaque individual opcional' },
    { cat: 'mesas', shape: 't3 r', id: '1606313564200-e75d5e30476c', name: 'Estación de chocolate caliente', desc: 'Chocolate de mesa preparado en vivo con toppings: malvaviscos, canela, queso y almojábanas.', detail: 'Para eventos de 30 personas en adelante' },
    { cat: 'individuales', shape: 't2', id: '1636743715220-d8f8dd900b87', name: 'Brownies con nueces', desc: 'Brownie denso de chocolate oscuro con nueces tostadas y superficie craquelada.', detail: 'Bandejas de 12 o 24 cuadros' },
    { cat: 'tortas', shape: 't2', id: '1676300185983-d5f242babe34', name: 'Torta de zanahoria y especias', desc: 'Zanahoria, nueces y especias con frosting de queso crema y naranja.', detail: 'Desde 12 porciones' },
    { cat: 'personalizados', shape: 't1', id: '1764380746142-b35392fe7428', name: 'Mini tortas de cumpleaños', desc: 'Tortas de 4 a 6 porciones con mensaje y decoración a tu elección.', detail: 'Pedido con 3 días de anticipación' },
    { cat: 'mesas', shape: 't1', id: '1675949873154-7496809f1c9b', name: 'Mesa de postres corporativa', desc: 'Selección de bocados dulces con los colores de tu marca para lanzamientos y eventos.', detail: 'Desde 50 personas' },
  ];
  const FILTERS = [['todo', 'Todo'], ['tortas', 'Tortas'], ['individuales', 'Postres individuales'], ['galletas', 'Galletas'], ['mesas', 'Mesas de dulces'], ['personalizados', 'Pedidos personalizados']];

  const $ = (s) => document.querySelector(s);
  const pills = $('.pills'), grid = $('.masonry'), count = $('.count'), lb = $('.lb');
  let filter = 'todo', list = ITEMS, open = 0;

  const render = () => {
    list = ITEMS.filter((x) => filter === 'todo' || x.cat === filter);
    pills.innerHTML = FILTERS.map(([id, label]) => `<button type="button" class="pill" data-f="${id}" aria-pressed="${filter === id}">${label}</button>`).join('');
    count.textContent = `${list.length} ${list.length === 1 ? 'creación' : 'creaciones'}`;
    grid.innerHTML = list.map((x, i) => `<button type="button" class="tile" style="--n:${i}" data-i="${i}" aria-label="Ver ${x.name}">
<div class="ph ${x.shape}"><img src="${img(x.id, 600)}" alt="" loading="${i < 4 ? 'eager' : 'lazy'}"></div>
<div class="tmeta"><b>${x.name}</b><small>${CATS[x.cat]}</small></div></button>`).join('');
  };

  const show = (i) => {
    open = (i + list.length) % list.length;
    const x = list[open];
    $('#lb-img').src = img(x.id, 1200);
    $('#lb-img').alt = x.name;
    $('#lb-cat').textContent = CATS[x.cat];
    $('#lb-name').textContent = x.name;
    $('#lb-desc').textContent = x.desc;
    $('#lb-detail').textContent = x.detail;
    if (!lb.open) lb.showModal();
  };

  pills.addEventListener('click', (e) => {
    const f = e.target.closest('[data-f]')?.dataset.f;
    if (f) { filter = f; render(); pills.querySelector(`[data-f="${f}"]`).focus(); }
  });
  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (tile) show(+tile.dataset.i);
  });
  lb.addEventListener('click', (e) => {
    const act = e.target.closest('[data-lb]')?.dataset.lb;
    if (act === 'close' || e.target === lb) lb.close(); // e.target === lb means the backdrop
    else if (act) show(open + (act === 'next' ? 1 : -1));
  });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(open + 1);
    if (e.key === 'ArrowLeft') show(open - 1);
  });

  render();
})();
