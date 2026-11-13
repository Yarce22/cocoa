(() => {
  const WA = '573000000000'; // TODO: replace with Cocoa's real WhatsApp number (digits only, with country code)

  const P = {
    cloche: 'M3 18h18M5 18a7 7 0 0 1 14 0M12 11V9M10.5 9h3',
    cake: 'M4 20h16M5 20v-6.5h14V20M5 16.5c1.7 1 3.3 1 5 0s3.3-1 5 0 3.3 1 4 0M7.5 13.5V10h9v3.5M12 10V7.5M12 4.5c.8.8.8 1.6 0 2.2-.8-.6-.8-1.4 0-2.2',
    hat: 'M7.5 21h9M7.5 17.5h9M7.5 17.5v-4A3.6 3.6 0 0 1 6.4 6.6 4 4 0 0 1 12 4.6a4 4 0 0 1 5.6 2 3.6 3.6 0 0 1-1.1 6.9v4',
    question: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.6M12 17h.01',
    rings: 'M9 20.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM15 20.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10 6.5 12 3.5l2 3',
    balloon: 'M12 15c-3 0-5.5-3-5.5-6.5a5.5 5.5 0 0 1 11 0C17.5 12 15 15 12 15zM11 17h2l-1-2zM12 17c0 2-2 2-1.5 4.5',
    briefcase: 'M3.5 8h17v12h-17zM8.5 8V5.5h7V8M3.5 13h17M12 12v2',
    wine: 'M8 3h8l-.4 5a3.6 3.6 0 0 1-7.2 0zM12 11.6V20M8.5 20h7',
    sparkle: 'M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7zM19 16c.2 1.4.8 2 2 2.2-1.2.2-1.8.8-2 2.2-.2-1.4-.8-2-2-2.2 1.2-.2 1.8-.8 2-2.2z',
    p1: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0',
    p2: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20.5a6.5 6.5 0 0 1 13 0M15.5 4.3a3.5 3.5 0 0 1 0 6.4M18 14a6.5 6.5 0 0 1 3.5 6.5',
    p3: 'M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6.5 20a5.5 5.5 0 0 1 11 0M5 12a2.3 2.3 0 1 0 0-4.6A2.3 2.3 0 0 0 5 12zM1.5 18.5A4.2 4.2 0 0 1 5.5 15M19 12a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM22.5 18.5a4.2 4.2 0 0 0-4-3.5',
    p4: 'M12 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 16a4 4 0 0 1 8 0M5 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM2 19a3.2 3.2 0 0 1 4.5-3M22 19a3.2 3.2 0 0 0-4.5-3M3 21.5h18',
    cal: 'M5 5h14a1.5 1.5 0 0 1 1.5 1.5V18.500a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V6.5A1.5 1.5 0 0 1 5 5zM3.5 10h17M8 3v4M16 3v4',
    calq: 'M5 5h14a1.5 1.5 0 0 1 1.5 1.5V18.500a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V6.5A1.5 1.5 0 0 1 5 5zM8 3v4M16 3v4M10.2 12.2a1.9 1.9 0 1 1 2.6 1.7c-.5.2-.8.6-.8 1.1M12 17.600h.01',
  };
  const CHOICES = [
    { key: 'servicio', title: '¿Qué estás buscando?', hint: 'Elige la opción que más se parezca a lo que tienes en mente.', opts: [['Catering', 'Menú completo para tu evento', P.cloche], ['Repostería', 'Tortas, postres y mesas de dulces', P.cake], ['Chef privado', 'Una cena especial en tu casa', P.hat], ['No estoy seguro', 'Te ayudamos a decidir', P.question]] },
    { key: 'ocasion', title: '¿Qué tipo de ocasión es?', hint: 'Así sabemos el tono y el estilo de la propuesta.', opts: [['Boda', 'Matrimonio, pedida o aniversario', P.rings], ['Cumpleaños', 'De 1 a 100 años', P.balloon], ['Evento corporativo', 'Reuniones, lanzamientos, fin de año', P.briefcase], ['Reunión íntima', 'Cena o encuentro en casa', P.wine], ['Otro', 'Cuéntanos más adelante', P.sparkle]] },
    { key: 'personas', title: '¿Para cuántas personas?', hint: 'Un aproximado está perfecto.', opts: [['Hasta 10', 'Algo íntimo', P.p1], ['11–30', 'Reunión mediana', P.p2], ['31–80', 'Celebración grande', P.p3], ['Más de 80', 'Gran evento', P.p4]] },
  ];
  const CITIES = ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'Armenia', 'Manizales'];
  const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const SUMMARY = 7;

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const icon = (d, size = 28) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const CHECK = '<span class="ck" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5L20 7"/></svg></span>';

  const a = { servicio: '', ocasion: '', personas: '', fecha: '', sinFecha: false, lugar: '', notas: '', nombre: '' };
  let step = 0;
  const host = $('#q-step'), back = $('#q-back');

  const fechaTxt = () => {
    if (a.sinFecha) return 'Aún no la defino';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(a.fecha);
    return m ? `${+m[3]} de ${MONTHS[+m[2] - 1]} de ${m[1]}` : '';
  };
  const valid = () => [!!a.servicio, !!a.ocasion, !!a.personas, a.sinFecha || !!a.fecha, a.lugar.trim().length > 1, true, a.nombre.trim().length > 0][step];
  const message = () => {
    const lines = [`Hola, Cocoa. Soy ${a.nombre.trim() || '—'} y quiero cotizar un evento.`, '',
      `• Servicio: ${a.servicio || '—'}`, `• Ocasión: ${a.ocasion || '—'}`, `• Personas: ${a.personas || '—'}`,
      `• Fecha: ${fechaTxt() || '—'}`, `• Lugar: ${a.lugar.trim() || '—'}`];
    if (a.notas.trim()) lines.push(`• Detalles: ${a.notas.trim()}`);
    return [...lines, '', 'Quedo pendiente de su propuesta. ¡Gracias!'].join('\n');
  };

  const head = (num, title, hint, forId) => `<p class="eyebrow">${num}</p>
<h2 class="serif">${forId ? `<label for="${forId}">${title}</label>` : title}</h2><p class="hint">${hint}</p>`;
  const nextBtn = (label = 'Siguiente', extra = '') => `<div class="q-actions"><button type="button" class="btn" data-act="next">${label} <i class="arr"></i></button>${extra}</div>`;

  const views = [
    ...CHOICES.map((q, n) => () => `${head(`Pregunta 0${n + 1}`, q.title, q.hint)}
<div class="opts" role="radiogroup" aria-label="${q.title}">${q.opts.map(([label, sub, d], i) => `<button type="button" role="radio" aria-checked="${a[q.key] === label}" class="opt${a[q.key] === label ? ' sel' : ''}" style="--n:${i}" data-pick="${label}"><span class="ic">${icon(d)}</span>${CHECK}<b>${label}</b><small>${sub}</small></button>`).join('')}</div>`),
    () => {
      const t = new Date(), today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
      return `${head('Pregunta 04', '¿Qué fecha tienes en mente?', 'Si aún no es seguro, no pasa nada: podemos ayudarte a elegirla.')}
<div class="date-grid">
<label class="date-card"><span><span class="ic">${icon(P.cal, 24)}</span>Elegir fecha</span><input class="field" type="date" data-k="fecha" value="${esc(a.fecha)}" min="${today}"></label>
<button type="button" class="opt${a.sinFecha ? ' sel' : ''}" aria-pressed="${a.sinFecha}" data-act="nodate"><span class="ic">${icon(P.calq)}</span>${CHECK}<b>Aún no la defino</b><small>Te sugerimos fechas disponibles.</small></button>
</div>${nextBtn()}`;
    },
    () => `${head('Pregunta 05', '¿En qué ciudad o lugar será?', 'Ciudad, barrio, finca o salón. Atendemos todo el Eje Cafetero.', 'q-lugar')}
<input id="q-lugar" class="field" type="text" data-k="lugar" placeholder="Ej: Finca en Santa Rosa de Cabal" value="${esc(a.lugar)}" autocomplete="address-level2" enterkeyhint="next">
<div class="qchips">${CITIES.map((c) => `<button type="button" class="qchip" data-city="${c}">${c}</button>`).join('')}</div>${nextBtn()}`,
    () => `${head('Pregunta 06 · Opcional', '¿Algo que debamos saber?', 'Gustos, restricciones alimentarias (vegetariano, sin gluten, alergias), colores o la idea que tengas.', 'q-notas')}
<textarea id="q-notas" class="field" data-k="notas" placeholder="Ej: Somos 4 vegetarianos. Nos encanta el maracuyá y queremos una mesa de dulces en tonos tierra.">${esc(a.notas)}</textarea>${nextBtn('Siguiente', '<button type="button" class="q-skip" data-act="skip">Omitir</button>')}`,
    () => `${head('Pregunta 07 · Última', '¿Cómo te llamas?', 'Para saber con quién vamos a hablar.', 'q-nombre')}
<input id="q-nombre" class="field" type="text" data-k="nombre" placeholder="Tu nombre" value="${esc(a.nombre)}" autocomplete="name" enterkeyhint="done">${nextBtn('Ver resumen')}`,
    () => {
      const rows = [['Servicio', a.servicio], ['Ocasión', a.ocasion], ['Personas', a.personas], ['Fecha', fechaTxt()], ['Lugar', a.lugar], ['Detalles', a.notas || 'Sin detalles adicionales'], ['Nombre', a.nombre]];
      const name = a.nombre.trim();
      return `<p class="eyebrow">Todo listo</p><h2 class="serif">¡Gracias${name ? `, ${esc(name)}` : ''}! Este es tu evento</h2>
<p class="hint">Revisa tus respuestas. Al tocar el botón se abre WhatsApp con este mensaje listo para enviar.</p>
<div class="sumgrid"><div>${rows.map(([k, v], i) => `<div class="sumrow"><span class="k">${k}</span><span class="v">${esc(v || '—')}</span><button type="button" class="q-edit" data-go="${i}" aria-label="Editar ${k.toLowerCase()}">Editar</button></div>`).join('')}</div>
<div class="send"><div class="chat"><div class="chat-head"><img src="assets/logo.jpg" alt="" width="40" height="40"><span>Cocoa · Pastelería &amp; Catering<small>Vista previa del mensaje</small></span></div>
<div class="bubble">${esc(message())}<small>ahora ✓✓</small></div></div>
<a class="btn wa" href="https://wa.me/${WA}?text=${encodeURIComponent(message())}" target="_blank" rel="noopener"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#wa"/></svg>Enviar por WhatsApp</a>
<p>Te respondemos en horario de 8:00 a. m. a 6:00 p. m.</p></div></div>`;
    },
  ];

  const syncChrome = () => {
    back.disabled = step === 0;
    $('#q-label').textContent = step < SUMMARY ? `Paso ${step + 1} de 7` : 'Resumen';
    $('#q-bar').setAttribute('aria-valuenow', step);
    document.querySelectorAll('.seg').forEach((s, i) => s.classList.toggle('on', i <= step));
    const chips = [a.servicio, a.ocasion, a.personas && `${a.personas} personas`, step > 3 && fechaTxt(), step > 4 && a.lugar.trim(), step > 6 && a.nombre.trim()].filter(Boolean);
    $('#q-chips').innerHTML = chips.length ? chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('') : '<p>Aquí irán apareciendo tus respuestas.</p>';
    const next = host.querySelector('[data-act="next"]');
    if (next) next.disabled = !valid();
  };

  const go = (n) => {
    const dir = n < step ? ' rev' : '';
    step = n;
    host.innerHTML = `<div class="qstep${dir}">${views[step]()}</div>`;
    syncChrome();
    const top = $('.qz-top').getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.6) scrollTo({ top: scrollY + top - 90, behavior: 'smooth' });
    // Only auto-focus where it will not pop a touch keyboard over the question.
    if (matchMedia('(hover:hover)').matches) host.querySelector('.field:not([type=date])')?.focus();
  };
  const next = () => valid() && step < SUMMARY && go(step + 1);

  host.addEventListener('click', (e) => {
    const el = e.target.closest('[data-pick],[data-act],[data-city],[data-go]');
    if (!el) return;
    if (el.dataset.pick) {
      a[CHOICES[step].key] = el.dataset.pick;
      host.querySelectorAll('.opt').forEach((o) => { o.classList.toggle('sel', o === el); o.setAttribute('aria-checked', o === el); });
      syncChrome();
      const from = step;
      setTimeout(() => step === from && go(from + 1), 380); // let the check animate before moving on
    } else if (el.dataset.act === 'nodate') {
      a.sinFecha = !a.sinFecha;
      if (a.sinFecha) a.fecha = '';
      go(step);
    } else if (el.dataset.act === 'skip') { a.notas = ''; go(6); }
    else if (el.dataset.act === 'next') next();
    else if (el.dataset.city) { a.lugar = el.dataset.city; host.querySelector('#q-lugar').value = a.lugar; syncChrome(); }
    else if (el.dataset.go) go(+el.dataset.go);
  });
  host.addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    a[k] = e.target.value;
    if (k === 'fecha' && a.fecha && a.sinFecha) { a.sinFecha = false; host.querySelector('[data-act="nodate"]').classList.remove('sel'); }
    syncChrome();
  });
  host.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input.field')) { e.preventDefault(); next(); }
  });
  back.addEventListener('click', () => step > 0 && go(step - 1));

  go(0);
})();
