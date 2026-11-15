import { defineArrayMember, defineField, defineType } from 'sanity';

const f = defineField;
const str = (name: string, title: string, description?: string) => f({ name, title, type: 'string', description });
const txt = (name: string, title: string, description?: string) => f({ name, title, type: 'text', rows: 3, description });
const titular = (name = 'titulo', title = 'Título') => f({ name, title, type: 'titular' });
const foto = (name = 'foto', title = 'Foto') => f({ name, title, type: 'foto' });
const seo = f({ name: 'seo', title: 'Google y redes sociales', type: 'seo', group: 'seo' });
const palabras = (name: string, title: string, description: string) =>
  f({ name, title, type: 'array', of: [{ type: 'string' }], description, options: { layout: 'tags' } });

/* ---------------------------------------------------------------- settings */
export const ajustes = defineType({
  name: 'ajustes',
  title: 'Datos generales',
  type: 'document',
  groups: [
    { name: 'contacto', title: 'Contacto', default: true },
    { name: 'redes', title: 'Redes sociales' },
    { name: 'menu', title: 'Menú y botones' },
    { name: 'pie', title: 'Pie de página' },
  ],
  fields: [
    f({ name: 'whatsapp', title: 'Número de WhatsApp', type: 'string', group: 'contacto', description: 'Solo números, con el 57 de Colombia adelante. Ej: 573001234567', validation: (r) => r.required().regex(/^\d{10,15}$/, { name: 'número' }).error('Escribe solo números, con el 57 adelante.') }),
    f({ name: 'whatsappVisible', title: 'WhatsApp como se muestra', type: 'string', group: 'contacto', description: 'Ej: +57 300 123 4567' }),
    f({ name: 'email', title: 'Correo electrónico', type: 'string', group: 'contacto', validation: (r) => r.email() }),
    f({ name: 'ciudad', title: 'Ubicación', type: 'string', group: 'contacto', description: 'Ej: Pereira, Risaralda · Colombia' }),
    f({ name: 'ciudadCorta', title: 'Ubicación corta (menú del celular)', type: 'string', group: 'contacto', description: 'Ej: Pereira, Risaralda' }),
    f({ name: 'nota', title: 'Nota de pedidos', type: 'string', group: 'contacto', description: 'Ej: Pedidos con 5 días de anticipación' }),
    f({ name: 'instagram', title: 'Enlace de Instagram', type: 'url', group: 'redes' }),
    f({ name: 'tiktok', title: 'Enlace de TikTok', type: 'url', group: 'redes' }),
    f({ name: 'facebook', title: 'Enlace de Facebook', type: 'url', group: 'redes' }),
    f({ name: 'usuarioRedes', title: 'Usuario en redes', type: 'string', group: 'redes', description: 'Ej: @cocoa.pasteleria' }),
    f({ name: 'menuCatering', title: 'Menú: Catering', type: 'string', group: 'menu' }),
    f({ name: 'menuReposteria', title: 'Menú: Repostería', type: 'string', group: 'menu' }),
    f({ name: 'menuNosotros', title: 'Menú: Nosotros', type: 'string', group: 'menu' }),
    f({ name: 'menuInicio', title: 'Menú: Inicio (celular)', type: 'string', group: 'menu' }),
    f({ name: 'botonCotizar', title: 'Botón principal "Cotiza tu evento"', type: 'string', group: 'menu', description: 'Texto del botón que lleva al cotizador. Aparece en el menú y en varias páginas.' }),
    f({ name: 'botonWhatsapp', title: 'Botón flotante de WhatsApp', type: 'string', group: 'menu', description: 'Ej: Escríbenos' }),
    f({ name: 'pieTitulo', title: 'Frase grande del pie', type: 'titular', group: 'pie' }),
    f({ name: 'pieDescripcion', title: 'Descripción del negocio', type: 'text', rows: 3, group: 'pie' }),
    f({ name: 'pieExplora', title: 'Título "Explora"', type: 'string', group: 'pie' }),
    f({ name: 'pieHablemos', title: 'Título "Hablemos"', type: 'string', group: 'pie' }),
    f({ name: 'pieSiguenos', title: 'Título "Síguenos"', type: 'string', group: 'pie' }),
    f({ name: 'pieCopyright', title: 'Texto de derechos', type: 'string', group: 'pie', description: 'Ej: © 2026 Cocoa · Pastelería & Catering' }),
    f({ name: 'pieFirma', title: 'Firma', type: 'string', group: 'pie', description: 'Ej: Hecho a mano en el Eje Cafetero' }),
  ],
  preview: { prepare: () => ({ title: 'Datos generales' }) },
});

/* ------------------------------------------------------------------- home */
export const inicio = defineType({
  name: 'inicio',
  title: 'Página de inicio',
  type: 'document',
  groups: [
    { name: 'portada', title: 'Portada', default: true },
    { name: 'cocina', title: 'Nuestra cocina' },
    { name: 'servicios', title: 'Servicios' },
    { name: 'favoritos', title: 'Favoritos' },
    { name: 'historia', title: 'Historia' },
    { name: 'final', title: 'Llamado final' },
    { name: 'seo', title: 'Google' },
  ],
  fields: [
    f({ name: 'portadaFotos', title: 'Fotos de portada', type: 'array', group: 'portada', of: [{ type: 'foto' }], description: 'Se muestran de fondo, una tras otra. Recomendado: 3 fotos horizontales.', validation: (r) => r.min(1).max(5) }),
    f({ ...titular('portadaTitulo', 'Título de portada'), group: 'portada' }),
    f({ ...str('portadaSubtitulo', 'Subtítulo'), group: 'portada' }),
    f({ ...str('portadaBoton', 'Botón principal'), group: 'portada' }),
    f({ ...str('portadaEnlace', 'Enlace secundario (a repostería)'), group: 'portada' }),
    f({ ...str('portadaSello', 'Texto del sello giratorio', 'Ej: Cotiza tu evento · Hecho a mano ·'), group: 'portada' }),
    f({ ...str('portadaDesliza', 'Indicación "Desliza"'), group: 'portada' }),
    f({ ...palabras('cinta', 'Palabras de la cinta animada', 'Las palabras que pasan en movimiento bajo la portada.'), group: 'portada' }),
    f({ ...str('cocinaEtiqueta', 'Etiqueta pequeña'), group: 'cocina' }),
    f({ name: 'cocinaFrase', title: 'Frase principal', type: 'frase', group: 'cocina' }),
    f({ name: 'cocinaPuntos', title: 'Puntos destacados', type: 'array', of: [{ type: 'tituloYTexto' }], group: 'cocina', validation: (r) => r.max(3) }),
    f({ ...foto('cocinaFoto', 'Foto grande'), group: 'cocina' }),
    f({ ...foto('cocinaFotoPequena', 'Foto pequeña redonda'), group: 'cocina' }),
    f({ ...str('serviciosEtiqueta', 'Etiqueta pequeña'), group: 'servicios' }),
    f({ ...titular('serviciosTitulo'), group: 'servicios' }),
    f({ ...txt('serviciosTexto', 'Texto'), group: 'servicios' }),
    f({
      name: 'serviciosTarjetas', title: 'Tarjetas de servicios', type: 'array', group: 'servicios', validation: (r) => r.max(3),
      of: [defineArrayMember({
        type: 'object', name: 'tarjeta', title: 'Tarjeta',
        fields: [
          str('etiqueta', 'Etiqueta', 'Ej: 01 · Catering'), str('titulo', 'Título'), txt('texto', 'Texto'), foto(),
          str('enlace', 'Texto del enlace'),
          f({ name: 'destino', title: 'Lleva a la página', type: 'string', options: { list: [{ title: 'Catering', value: '/catering' }, { title: 'Repostería', value: '/reposteria' }, { title: 'Nosotros', value: '/nosotros' }, { title: 'Cotizador', value: '/contacto' }], layout: 'radio' }, initialValue: '/catering' }),
        ],
        preview: { select: { title: 'titulo', subtitle: 'etiqueta', media: 'foto' } },
      })],
    }),
    f({ ...str('favoritosEtiqueta', 'Etiqueta pequeña'), group: 'favoritos' }),
    f({ ...titular('favoritosTitulo'), group: 'favoritos' }),
    f({ ...str('favoritosEnlace', 'Texto del enlace a la galería'), group: 'favoritos', description: 'Los postres que aparecen aquí se eligen en "Postres" marcando "Mostrar en el inicio".' }),
    f({ ...str('favoritosDesliza', 'Indicación "Desliza"', 'Texto pequeño bajo los postres que invita a deslizar.'), group: 'favoritos' }),
    f({ ...str('historiaEtiqueta', 'Etiqueta pequeña'), group: 'historia' }),
    f({ name: 'historiaCita', title: 'Cita', type: 'frase', group: 'historia' }),
    f({ ...txt('historiaTexto', 'Texto'), group: 'historia' }),
    f({ ...str('historiaEnlace', 'Texto del enlace'), group: 'historia' }),
    f({ ...foto('historiaFoto', 'Foto (se recorta con forma de gorro)'), group: 'historia' }),
    f({ ...titular('finalTitulo'), group: 'final' }),
    f({ ...txt('finalTexto', 'Texto'), group: 'final' }),
    f({ ...str('finalBoton', 'Botón'), group: 'final' }),
    seo,
  ],
  preview: { prepare: () => ({ title: 'Página de inicio' }) },
});

/* --------------------------------------------------------------- catering */
export const catering = defineType({
  name: 'catering',
  title: 'Página de catering',
  type: 'document',
  groups: [
    { name: 'portada', title: 'Portada', default: true },
    { name: 'servicios', title: 'Servicios' },
    { name: 'pasos', title: 'Paso a paso' },
    { name: 'final', title: 'Llamado final' },
    { name: 'seo', title: 'Google' },
  ],
  fields: [
    f({ ...str('etiqueta', 'Etiqueta pequeña'), group: 'portada' }),
    f({ ...titular(), group: 'portada' }),
    f({ ...txt('texto', 'Texto'), group: 'portada' }),
    f({ ...foto(), group: 'portada' }),
    f({ ...palabras('cinta', 'Palabras de la cinta animada', 'Las palabras que pasan en movimiento.'), group: 'portada' }),
    f({ ...titular('serviciosTitulo'), group: 'servicios' }),
    f({ ...txt('serviciosTexto', 'Texto'), group: 'servicios' }),
    f({ ...str('idealPara', 'Texto "Ideal para"'), group: 'servicios' }),
    f({
      name: 'servicios', title: 'Servicios', type: 'array', group: 'servicios',
      of: [defineArrayMember({
        type: 'object', name: 'servicio', title: 'Servicio',
        fields: [
          str('etiqueta', 'Etiqueta', 'Ej: 01 · Empresas'), str('titulo', 'Título'), txt('texto', 'Texto'), foto(),
          palabras('ideal', 'Ideal para', 'Escribe cada ocasión y presiona Enter.'),
          str('incluye', 'Qué incluye', 'Ej: Incluye: menú a la medida, meseros, montaje y menaje.'),
        ],
        preview: { select: { title: 'titulo', subtitle: 'etiqueta', media: 'foto' } },
      })],
    }),
    f({ ...str('pasosEtiqueta', 'Etiqueta pequeña'), group: 'pasos' }),
    f({ ...titular('pasosTitulo'), group: 'pasos' }),
    f({ ...txt('pasosTexto', 'Texto'), group: 'pasos' }),
    f({ name: 'pasos', title: 'Pasos', type: 'array', of: [{ type: 'tituloYTexto' }], group: 'pasos', validation: (r) => r.max(4) }),
    f({ ...titular('finalTitulo'), group: 'final' }),
    f({ ...str('finalTexto', 'Texto'), group: 'final' }),
    f({ ...str('finalBoton', 'Botón'), group: 'final' }),
    seo,
  ],
  preview: { prepare: () => ({ title: 'Página de catering' }) },
});

/* ------------------------------------------------------------- repostería */
export const reposteria = defineType({
  name: 'reposteria',
  title: 'Página de repostería',
  type: 'document',
  groups: [
    { name: 'portada', title: 'Portada', default: true },
    { name: 'galeria', title: 'Galería' },
    { name: 'final', title: 'Pedidos personalizados' },
    { name: 'seo', title: 'Google' },
  ],
  fields: [
    f({ ...str('etiqueta', 'Etiqueta pequeña'), group: 'portada' }),
    f({ ...titular(), group: 'portada' }),
    f({ ...txt('texto', 'Texto'), group: 'portada' }),
    f({ ...str('filtroTodo', 'Botón de filtro "Todo"'), group: 'galeria', description: 'Los postres y categorías se editan en "Postres" y "Categorías de postres".' }),
    f({ ...str('botonPedir', 'Botón en la foto ampliada', 'Ej: Pedir algo así'), group: 'galeria' }),
    f({ ...str('contadorUno', 'Contador: palabra para 1 postre', 'Se muestra como "1 creación".'), group: 'galeria' }),
    f({ ...str('contadorVarios', 'Contador: palabra para varios postres', 'Se muestra como "14 creaciones".'), group: 'galeria' }),
    f({ ...str('finalEtiqueta', 'Etiqueta pequeña'), group: 'final' }),
    f({ ...titular('finalTitulo'), group: 'final' }),
    f({ ...txt('finalTexto', 'Texto'), group: 'final' }),
    f({ ...str('finalBoton', 'Botón'), group: 'final' }),
    f({ ...foto('finalFoto', 'Foto'), group: 'final' }),
    seo,
  ],
  preview: { prepare: () => ({ title: 'Página de repostería' }) },
});

/* --------------------------------------------------------------- nosotros */
const ICONOS_VALOR = [
  { title: 'Gorro de cocina', value: 'gorro' },
  { title: 'Hoja', value: 'hoja' },
  { title: 'Reloj', value: 'reloj' },
  { title: 'Corazón', value: 'corazon' },
];
export const nosotros = defineType({
  name: 'nosotros',
  title: 'Página de nosotros',
  type: 'document',
  groups: [
    { name: 'portada', title: 'Portada', default: true },
    { name: 'historia', title: 'Línea de tiempo' },
    { name: 'equipo', title: 'Equipo' },
    { name: 'valores', title: 'Valores' },
    { name: 'seo', title: 'Google' },
  ],
  fields: [
    f({ ...str('etiqueta', 'Etiqueta pequeña'), group: 'portada' }),
    f({ ...titular(), group: 'portada' }),
    f({ ...txt('texto', 'Texto'), group: 'portada' }),
    f({
      name: 'momentos', title: 'Momentos de la historia', type: 'array', group: 'historia',
      of: [defineArrayMember({
        type: 'object', name: 'momento', title: 'Momento',
        fields: [str('anio', 'Año', 'Ej: 2019 u "Hoy"'), str('titulo', 'Título'), txt('texto', 'Texto'), foto()],
        preview: { select: { title: 'titulo', subtitle: 'anio', media: 'foto' } },
      })],
    }),
    f({ ...str('equipoEtiqueta', 'Etiqueta pequeña'), group: 'equipo' }),
    f({ ...titular('equipoTitulo'), group: 'equipo' }),
    f({ ...txt('equipoTexto', 'Texto'), group: 'equipo', description: 'Las personas del equipo se editan en "Equipo".' }),
    f({ ...str('valoresEtiqueta', 'Etiqueta pequeña'), group: 'valores' }),
    f({ ...titular('valoresTitulo'), group: 'valores' }),
    f({
      name: 'valores', title: 'Valores', type: 'array', group: 'valores', validation: (r) => r.max(4),
      of: [defineArrayMember({
        type: 'object', name: 'valor', title: 'Valor',
        fields: [
          f({ name: 'icono', title: 'Ícono', type: 'string', options: { list: ICONOS_VALOR, layout: 'radio' }, initialValue: 'gorro' }),
          str('titulo', 'Título'), txt('texto', 'Texto'),
        ],
        preview: { select: { title: 'titulo', subtitle: 'texto' } },
      })],
    }),
    f({ ...str('valoresBoton', 'Botón'), group: 'valores' }),
    seo,
  ],
  preview: { prepare: () => ({ title: 'Página de nosotros' }) },
});

/* --------------------------------------------------------------- contacto */
const ICONOS_QUIZ = [
  ['cloche', 'Bandeja'], ['cake', 'Torta'], ['hat', 'Gorro de chef'], ['question', 'Pregunta'], ['rings', 'Anillos'],
  ['balloon', 'Globo'], ['briefcase', 'Maletín'], ['wine', 'Copa'], ['sparkle', 'Destello'],
  ['p1', '1 persona'], ['p2', '2 personas'], ['p3', 'Grupo'], ['p4', 'Multitud'],
].map(([value, title]) => ({ value, title }));
const pregunta = (name: string, title: string, extra: ReturnType<typeof f>[] = []) =>
  f({ name, title, type: 'object', group: 'quiz', options: { collapsible: true, collapsed: true }, fields: [str('titulo', 'Pregunta'), txt('ayuda', 'Texto de ayuda'), ...extra] });

export const contacto = defineType({
  name: 'contacto',
  title: 'Página del cotizador',
  type: 'document',
  groups: [
    { name: 'lateral', title: 'Texto lateral', default: true },
    { name: 'quiz', title: 'Preguntas' },
    { name: 'resumen', title: 'Resumen y mensaje' },
    { name: 'botones', title: 'Botones y textos' },
    { name: 'seo', title: 'Google' },
  ],
  fields: [
    f({ ...str('titulo', 'Título'), group: 'lateral' }),
    f({ ...txt('texto', 'Texto'), group: 'lateral' }),
    f({ ...str('respuestasTitulo', 'Título "Tu evento hasta ahora"'), group: 'lateral' }),
    f({ ...str('respuestasVacio', 'Texto antes de responder'), group: 'lateral' }),
    f({
      name: 'opciones', title: 'Preguntas de selección (1 a 3)', type: 'array', group: 'quiz', validation: (r) => r.length(3),
      description: 'Las tres primeras preguntas: servicio, ocasión y número de personas. Puedes cambiar los textos y las opciones.',
      of: [defineArrayMember({
        type: 'object', name: 'preguntaOpciones', title: 'Pregunta',
        fields: [
          str('titulo', 'Pregunta'), txt('ayuda', 'Texto de ayuda'),
          f({
            name: 'opciones', title: 'Opciones', type: 'array', validation: (r) => r.min(2).max(6),
            of: [defineArrayMember({
              type: 'object', name: 'opcion', title: 'Opción',
              fields: [str('texto', 'Opción'), str('detalle', 'Detalle'), f({ name: 'icono', title: 'Ícono', type: 'string', options: { list: ICONOS_QUIZ }, initialValue: 'sparkle' })],
              preview: { select: { title: 'texto', subtitle: 'detalle' } },
            })],
          }),
        ],
        preview: { select: { title: 'titulo' } },
      })],
    }),
    pregunta('fecha', 'Pregunta 4: fecha', [str('elegir', 'Texto "Elegir fecha"'), str('sinFecha', 'Opción "Aún no la defino"'), str('sinFechaDetalle', 'Detalle de esa opción')]),
    pregunta('lugar', 'Pregunta 5: lugar', [str('ejemplo', 'Texto de ejemplo en la casilla'), palabras('ciudades', 'Ciudades sugeridas', 'Botones rápidos con ciudades. Escribe cada una y presiona Enter.')]),
    pregunta('notas', 'Pregunta 6: detalles (opcional)', [str('ejemplo', 'Texto de ejemplo en la casilla')]),
    pregunta('nombre', 'Pregunta 7: nombre', [str('ejemplo', 'Texto de ejemplo en la casilla')]),
    f({ ...str('resumenTitulo', 'Título del resumen', 'Se muestra como: ¡Gracias, Ana! Este es tu evento'), group: 'resumen' }),
    f({ ...txt('resumenTexto', 'Texto del resumen'), group: 'resumen' }),
    f({ ...str('saludo', 'Primera línea del mensaje de WhatsApp', 'Usa {nombre} donde va el nombre. Ej: Hola, Cocoa. Soy {nombre} y quiero cotizar un evento.'), group: 'resumen' }),
    f({ ...str('despedida', 'Última línea del mensaje de WhatsApp'), group: 'resumen' }),
    f({
      name: 'interfaz', title: 'Botones y textos del cotizador', type: 'object', group: 'botones',
      options: { collapsible: true, collapsed: false },
      description: 'Textos pequeños de los botones, del avance y del resumen. Si dejas uno vacío se usa el texto original.',
      fields: [
        str('paso', 'Avance', 'Usa {n} para el número de paso y {total} para el total. Ej: Paso {n} de {total}'),
        str('resumen', 'Avance en el resumen', 'Ej: Resumen'),
        str('atras', 'Botón "Atrás"'),
        str('pregunta', 'Palabra "Pregunta"', 'Se muestra como: Pregunta 01'),
        str('opcional', 'Marca de pregunta opcional', 'Ej: Opcional'),
        str('ultima', 'Marca de la última pregunta', 'Ej: Última'),
        str('siguiente', 'Botón "Siguiente"'),
        str('omitir', 'Botón "Omitir"'),
        str('verResumen', 'Botón "Ver resumen"'),
        str('todoListo', 'Etiqueta del resumen', 'Ej: Todo listo'),
        str('editar', 'Botón "Editar"'),
        str('vistaPrevia', 'Texto bajo el nombre en la vista previa', 'Ej: Vista previa del mensaje'),
        str('enviar', 'Botón de enviar', 'Ej: Enviar por WhatsApp'),
        str('horario', 'Horario de respuesta', 'Ej: Te respondemos en horario de 8:00 a. m. a 6:00 p. m.'),
        str('servicio', 'Resumen: Servicio'),
        str('ocasion', 'Resumen: Ocasión'),
        str('personas', 'Resumen: Personas'),
        str('fecha', 'Resumen: Fecha'),
        str('lugar', 'Resumen: Lugar'),
        str('detalles', 'Resumen: Detalles'),
        str('sinDetalles', 'Resumen: sin detalles', 'Se muestra si no escribieron detalles. Ej: Sin detalles adicionales'),
        str('nombre', 'Resumen: Nombre'),
      ],
    }),
    seo,
  ],
  preview: { prepare: () => ({ title: 'Página del cotizador' }) },
});

/* ------------------------------------------------------------ collections */
export const categoria = defineType({
  name: 'categoria',
  title: 'Categoría de postres',
  type: 'document',
  fields: [
    f({ name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    f({ name: 'nombreCorto', title: 'Nombre corto (tarjetas del inicio)', type: 'string', description: 'Opcional. Ej: "Individual" en vez de "Postres individuales".' }),
    f({ name: 'nombreFiltro', title: 'Texto del botón de filtro', type: 'string', description: 'Opcional. Texto del botón para filtrar en la galería. Si lo dejas vacío se usa el Nombre.' }),
    f({ name: 'orden', title: 'Orden', type: 'number', description: 'Número para ordenar los filtros: 1 va primero.', initialValue: 10 }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre' } },
});

export const postre = defineType({
  name: 'postre',
  title: 'Postre',
  type: 'document',
  fields: [
    f({ name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    f({ name: 'foto', title: 'Foto', type: 'foto', validation: (r) => r.required() }),
    f({ name: 'categoria', title: 'Categoría', type: 'reference', to: [{ type: 'categoria' }], validation: (r) => r.required() }),
    f({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
    f({ name: 'detalle', title: 'Detalle del pedido', type: 'string', description: 'Ej: Desde 12 porciones · Pedido con 3 días de anticipación' }),
    f({ name: 'alto', title: 'Tamaño en la galería', type: 'string', initialValue: 't2', options: { layout: 'radio', direction: 'horizontal', list: [{ title: 'Bajo', value: 't1' }, { title: 'Mediano', value: 't2' }, { title: 'Alto', value: 't3' }] } }),
    f({ name: 'arco', title: 'Borde superior en arco', type: 'boolean', initialValue: false }),
    f({ name: 'destacado', title: 'Mostrar en el inicio', type: 'boolean', initialValue: false, description: 'Aparece en "Los favoritos de la casa" de la página de inicio.' }),
    f({ name: 'nombreInicio', title: 'Nombre corto para el inicio', type: 'string', description: 'Opcional. Si lo dejas vacío se usa el nombre.', hidden: ({ parent }) => !parent?.destacado }),
    f({ name: 'ordenInicio', title: 'Orden en el inicio', type: 'number', description: 'Número para ordenar los postres del inicio: 1 va primero.', hidden: ({ parent }) => !parent?.destacado }),
    f({ name: 'enGaleria', title: 'Mostrar en la galería de repostería', type: 'boolean', initialValue: true, description: 'Desactívalo si el postre solo debe aparecer en el inicio.' }),
    f({ name: 'orden', title: 'Orden', type: 'number', initialValue: 10, description: 'Número para ordenar en la galería: 1 va primero.' }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre', subtitle: 'categoria.nombre', media: 'foto' } },
});

export const miembro = defineType({
  name: 'miembro',
  title: 'Persona del equipo',
  type: 'document',
  fields: [
    f({ name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    f({ name: 'cargo', title: 'Cargo', type: 'string' }),
    f({ name: 'bio', title: 'Descripción', type: 'text', rows: 3 }),
    f({ name: 'foto', title: 'Foto (opcional)', type: 'foto', description: 'Si no hay foto se muestra el gorro de Cocoa.' }),
    f({ name: 'orden', title: 'Orden', type: 'number', initialValue: 10 }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre', subtitle: 'cargo', media: 'foto' } },
});

export const documentTypes = [ajustes, inicio, catering, reposteria, nosotros, contacto, categoria, postre, miembro];
