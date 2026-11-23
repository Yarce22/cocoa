#!/usr/bin/env node
/**
 * Importación inicial (una sola vez, idempotente) del contenido actual del sitio a Sanity.
 *
 *   npm run seed              → sube las fotos y crea/reemplaza todos los documentos
 *   node scripts/seed.mjs --dry-run   → sin red ni token: imprime los documentos en JSON
 *   npm run seed -- --only=reposteria → solo crea/reemplaza esos documentos (separados por coma)
 *
 * Variables: PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET (por defecto "production"), SANITY_WRITE_TOKEN.
 * Los _id son fijos, así que volver a ejecutarlo reemplaza los mismos documentos, y las fotos
 * ya subidas se reutilizan (se buscan por nombre de archivo "unsplash-<id>.jpg").
 */

const DRY_RUN = process.argv.includes('--dry-run');

/* ------------------------------------------------------------------ helpers */

/** Image placeholder resolved later (upload) or printed as-is (dry run). */
const IMG = Symbol('img');
const photo = (id, w, alt) => ({ [IMG]: true, id, w, alt });

const ref = (_ref) => ({ _type: 'reference', _ref });
const keyed = (prefix, items) => items.map((item, i) => ({ _key: `${prefix}${i + 1}`, ...item }));

/** Title lines: each entry is [texto, resaltado?]; empty parts are omitted. */
const titular = (...lineas) => ({
  _type: 'titular',
  lineas: keyed('linea', lineas.map(([texto, resaltado]) => ({
    _type: 'linea',
    ...(texto ? { texto } : {}),
    ...(resaltado ? { resaltado } : {}),
  }))),
});
const frase = (texto, resaltado) => ({ _type: 'frase', texto, resaltado });
const tyt = (titulo, texto) => ({ _type: 'tituloYTexto', titulo, texto });
const seo = (titulo, descripcion) => ({ _type: 'seo', titulo, descripcion });

const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/* ----------------------------------------------------------------- settings */

const ajustes = {
  _id: 'ajustes',
  _type: 'ajustes',
  whatsapp: '573000000000',
  whatsappVisible: '+57 300 000 0000',
  email: 'hola@cocoa.com.co',
  ciudad: 'Pereira, Risaralda · Colombia',
  ciudadCorta: 'Pereira, Risaralda',
  nota: 'Pedidos con 5 días de anticipación',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
  facebook: 'https://facebook.com/',
  usuarioRedes: '@cocoa.pasteleria',
  menuCatering: 'Catering',
  menuReposteria: 'Repostería',
  menuGaleria: 'Galería',
  menuNosotros: 'Nosotros',
  menuInicio: 'Inicio',
  botonCotizar: 'Cotiza tu evento',
  botonWhatsapp: 'Escríbenos',
  pieTitulo: titular(['Endulcemos tu próxima'], ['', 'celebración.']),
  pieDescripcion: 'Catering, repostería y chef privado hechos a mano para celebraciones, empresas y cenas en casa.',
  pieExplora: 'Explora',
  pieHablemos: 'Hablemos',
  pieSiguenos: 'Síguenos',
  pieCopyright: '© 2026 Cocoa · Pastelería & Catering',
  pieFirma: 'Hecho a mano en el Eje Cafetero',
};

/* --------------------------------------------------------------------- home */

const inicio = {
  _id: 'inicio',
  _type: 'inicio',
  // Hero slides have alt="" in the markup (decorative); short descriptions for the Studio.
  portadaFotos: keyed('portada', [
    photo('1637534371564-458a3a29972f', 1800, 'Postres de Cocoa servidos para una celebración'),
    photo('1602351447937-745cb720612f', 1800, 'Repostería artesanal recién horneada'),
    photo('1775497950071-965cf9e20b2f', 1800, 'Chef decorando un plato pequeño con hojas frescas'),
  ]),
  portadaTitulo: titular(['Hecho'], ['', 'con el alma.']),
  portadaSubtitulo: 'Pasteleria y Catering.',
  portadaBoton: 'Cuéntanos tu evento',
  portadaEnlace: 'Ver la vitrina',
  portadaSello: 'Cotiza tu evento · Hecho a mano ·',
  portadaDesliza: 'Desliza',
  cinta: ['Catering', 'Repostería', 'Chef privado', 'Mesas de dulces', 'Coffee breaks', 'Bodas'],
  cocinaEtiqueta: 'Nuestra cocina',
  cocinaFrase: frase(
    'Creemos que la comida es la forma más honesta de celebrar. Horneamos, cocinamos y montamos cada mesa',
    'como si fuera para nuestra familia.',
  ),
  cocinaPuntos: keyed('punto', [
    tyt('Desde cero', 'Masas, rellenos y salsas hechos en nuestro obrador.'),
    tyt('Producto local', 'Frutas, lácteos y café de productores del Eje Cafetero.'),
    tyt('A tu medida', 'Cada menú se diseña para tu ocasión y tus invitados.'),
  ]),
  cocinaFoto: photo('1549590143-d5855148a9d5', 1000, 'Manos espolvoreando harina sobre una mesa de trabajo junto a huevos y un batidor'),
  cocinaFotoPequena: photo('1493925410384-84f842e616fb', 500, 'Mano sosteniendo granos de cacao secos'),
  serviciosEtiqueta: 'Lo que hacemos',
  serviciosTitulo: titular(['Tres maneras de'], ['', 'llenar tu mesa']),
  serviciosTexto: 'Desde un coffee break para tu equipo hasta la torta de tu boda o una cena privada en casa. Tú pones la ocasión; nosotros, todo lo demás.',
  serviciosTarjetas: keyed('tarjeta', [
    {
      _type: 'tarjeta',
      etiqueta: '01 · Catering',
      titulo: 'Eventos que se sienten en casa',
      texto: 'Menús completos, estaciones y servicio para bodas, empresas y celebraciones. Montaje, meseros y loza incluidos.',
      foto: photo('1761315414017-04c3906359d1', 1000, 'Surtido de bruschettas gourmet servidas en una bandeja de mármol'),
      enlace: 'Ver catering',
      destino: '/catering',
    },
    {
      _type: 'tarjeta',
      etiqueta: '02 · Repostería',
      titulo: 'Postres que cuentan algo',
      texto: 'Tortas, postres individuales, galletas y mesas de dulces. Por encargo y totalmente personalizados.',
      foto: photo('1623428454614-abaf00244e52', 1000, 'Torta blanca de varios pisos decorada con fresas y flores frescas'),
      enlace: 'Ver repostería',
      destino: '/reposteria',
    },
    {
      _type: 'tarjeta',
      etiqueta: '03 · Chef privado',
      titulo: 'Tu cocina, nuestro menú',
      texto: 'Cenas de varios tiempos preparadas y servidas en tu casa. Tú solo disfrutas: nosotros llegamos, cocinamos y dejamos todo limpio.',
      foto: photo('1775513153018-0c7ac7899751', 1000, 'Chef emplatando con pinzas un plato gourmet'),
      enlace: 'Conocer más',
      destino: '/catering',
    },
  ]),
  favoritosEtiqueta: 'Desde la vitrina',
  favoritosTitulo: titular(['Los favoritos', 'de la casa']),
  favoritosEnlace: 'Ver toda la galería',
  favoritosDesliza: 'Desliza',
  historiaEtiqueta: 'Nuestra historia',
  historiaCita: frase(
    '“Todo empezó en una cocina pequeña, con la receta de la abuela y un horno que no',
    'cerraba bien.”',
  ),
  historiaTexto: 'Lo que comenzó como pedidos para amigos y vecinos hoy es un equipo que cocina para bodas, empresas y cenas íntimas. La receta sigue siendo la misma: hacerlo todo con las manos y con calma.',
  historiaEnlace: 'Conoce cómo empezó',
  historiaFoto: photo('1612884610549-ce221d92514a', 1000, 'Manos amasando sobre una mesa de madera enharinada'),
  finalTitulo: titular(['¿Tienes una fecha'], ['especial', 'en mente?']),
  finalTexto: 'Responde 7 preguntas rápidas y te escribimos por WhatsApp con una propuesta hecha para ti.',
  finalBoton: 'Empezar el quiz',
  seo: seo('Cocoa · Pastelería & Catering en Pereira', 'Catering, repostería por encargo y chef privado en Pereira y el Eje Cafetero. Hecho a mano, servido con alma.'),
};

/* ----------------------------------------------------------------- catering */

const servicio = (etiqueta, titulo, texto, [id, alt], ideal, incluye) => ({
  _type: 'servicio', etiqueta, titulo, texto, foto: photo(id, 1000, alt), ideal, incluye,
});

const catering = {
  _id: 'catering',
  _type: 'catering',
  etiqueta: 'Catering · Eventos · Chef privado',
  titulo: titular(['Cocina deseñada'], ['', 'a la medida de tu evento']),
  texto: 'Diseñamos el menú, cocinamos todo desde cero y llegamos con el equipo y el montaje. Tú recibes a tus invitados; nosotros nos encargamos de que cada plato salga perfecto.',
  foto: photo('1720749406941-a899d2e38be3', 1100, 'Mesa larga de celebración decorada con flores blancas y azules y vegetación'),
  cinta: ['Bodas', 'Empresas', 'Mesas de dulces', 'Coffee breaks', 'Chef en casa'],
  serviciosTitulo: titular(['Nuestros servicios']),
  serviciosTexto: 'Cinco formatos que adaptamos al número de invitados, al lugar y a lo que te gusta comer.',
  idealPara: 'Ideal para',
  servicios: keyed('servicio', [
    servicio('01 · Empresas', 'Eventos corporativos',
      'Lanzamientos, cierres de año, reuniones de junta y almuerzos de equipo. Menús de cóctel, bufé o servido a la mesa, con la puntualidad y la presentación que tu marca necesita.',
      ['1761315414017-04c3906359d1', 'Surtido de bruschettas gourmet en bandeja de mármol'],
      ['Lanzamientos', 'Fiestas de fin de año', 'Almuerzos de trabajo', 'Ferias y activaciones'],
      'Incluye: menú a la medida, meseros, montaje y menaje. Facturación electrónica.'),
    servicio('02 · Celebraciones', 'Bodas y celebraciones',
      'Del cóctel de bienvenida a la torta. Cocinamos menús de tres o cuatro tiempos, estaciones en vivo y la torta de la novia, coordinados con tu wedding planner.',
      ['1758705477547-1070b9fac15d', 'Mesa de evento montada con velas y copas'],
      ['Bodas', 'Quinceañeros', 'Bautizos y primeras comuniones', 'Aniversarios'],
      'Incluye: degustación previa, menú completo, torta y coordinación el día del evento.'),
    servicio('03 · Dulce', 'Mesas de dulces y estaciones',
      'Mesas de postres diseñadas con la paleta de tu evento y estaciones interactivas: crepes, waffles, chocolate caliente o café de origen preparado al momento.',
      ['1774660811169-1174148a4880', 'Mesa con postres elegantes y arreglos florales'],
      ['Bodas', 'Baby showers', 'Cumpleaños', 'Eventos de marca'],
      'Incluye: diseño de la mesa, bases y bandejas, rotulación y montaje.'),
    servicio('04 · Oficina', 'Coffee breaks',
      'Café de la región, jugos naturales y una selección dulce y salada horneada esa misma mañana. Para capacitaciones, reuniones y jornadas largas.',
      ['1515823662972-da6a2e4d3002', 'Taza de café rodeada de panes recién horneados'],
      ['Capacitaciones', 'Reuniones', 'Congresos', 'Talleres'],
      'Incluye: montaje, menaje desechable compostable o de vidrio, y retiro al final.'),
    servicio('05 · En casa', 'Chef privado en casa',
      'Una cena de varios tiempos en tu propia cocina. Elegimos el menú contigo, compramos los ingredientes, cocinamos frente a tus invitados y dejamos todo limpio.',
      ['1775497950071-965cf9e20b2f', 'Chef decorando un plato pequeño con hojas frescas'],
      ['Cenas románticas', 'Cumpleaños íntimos', 'Reuniones de amigos', 'Clases de cocina'],
      'Incluye: menú de 3 a 5 tiempos, mercado, servicio a la mesa y limpieza de la cocina.'),
  ]),
  pasosEtiqueta: 'Paso a paso',
  pasosTitulo: titular(['Cómo', 'trabajamos']),
  pasosTexto: 'Un proceso sencillo y cercano, de la primera conversación al último plato.',
  pasos: keyed('paso', [
    tyt('Nos cuentas tu idea', 'Respondes el quiz en dos minutos y te escribimos por WhatsApp para conocer los detalles.'),
    tyt('Diseñamos la propuesta', 'Te enviamos un menú a la medida con opciones, montaje y cotización clara.'),
    tyt('Probamos juntos', 'Para bodas y eventos grandes agendamos una degustación y ajustamos cada plato.'),
    tyt('Llegamos y servimos', 'El día del evento montamos, servimos y recogemos. Tú solo disfrutas.'),
  ]),
  finalTitulo: titular(['Armemos el menú de tu evento']),
  finalTexto: '7 preguntas, 2 minutos y te escribimos por WhatsApp.',
  finalBoton: 'Empezar el quiz',
  seo: seo('Catering para eventos y chef privado · Cocoa', 'Catering para bodas, empresas y celebraciones en el Eje Cafetero: menú a la medida, montaje, meseros y loza. También chef privado en casa.'),
};

/* --------------------------------------------------------------- repostería */

const reposteria = {
  _id: 'reposteria',
  _type: 'reposteria',
  etiqueta: 'Repostería por encargo',
  titulo: titular(['El amor'], ['', 'es dulce']),
  texto: 'Tortas, postres individuales, galletas y mesas de dulces horneados a mano con mantequilla, cacao y frutas de la región. Tú eliges sabores y colores; nosotros lo horneamos para tu fecha.',
  foto: photo('1606890737304-57a1ca8a5b62', 1100, 'Torta de chocolate de tres capas con crema y cerezas'),
  cinta: ['Tortas', 'Postres individuales', 'Galletas', 'Mesas de dulces', 'Pedidos personalizados'],
  serviciosTitulo: titular(['Lo que horneamos']),
  serviciosTexto: 'Cuatro formas de endulzar tu celebración, hechas desde cero y a la medida de tu ocasión.',
  idealPara: 'Ideal para',
  servicios: keyed('servicio', [
    servicio('01 · Tortas', 'Tortas por encargo',
      'Bizcochos húmedos, rellenos caseros y coberturas hechas a mano. Clásicas como la tres leches o diseños de varios pisos para bodas, con el sabor y la decoración que imagines.',
      ['1761671613315-53157f91d0f8', 'Torta de bodas de tres pisos decorada con flores'],
      ['Cumpleaños', 'Bodas', 'Aniversarios', 'Bautizos'],
      'Incluye: diseño a tu gusto, mensaje personalizado y caja para transportar.'),
    servicio('02 · Individuales', 'Postres individuales',
      'Cheesecakes, tartaletas, brownies y vasitos listos para servir. Porciones bonitas y prácticas para reuniones, regalos o para completar una mesa de postres.',
      ['1620980776848-84ac10194945', 'Tartaletas de frutos rojos sobre una mesa de madera'],
      ['Reuniones', 'Regalos', 'Eventos de empresa', 'Mesas de postres'],
      'Incluye: empaque individual y presentación en bandeja. Mínimo 12 unidades.'),
    servicio('03 · Galletas', 'Galletas y alfajores',
      'Galletas de mantequilla con chips, alfajores de maicena y galletas decoradas con glaseado real, con el logo o las iniciales que quieras.',
      ['1782852232674-64bc7f102866', 'Galletas decoradas con glaseado'],
      ['Detalles para invitados', 'Regalos corporativos', 'Baby showers', 'Navidad'],
      'Incluye: cajas de 6, 12 o 24 unidades y empaque individual opcional.'),
    servicio('04 · Mesas', 'Mesas de dulces',
      'Una mesa completa de postres diseñada con la paleta de tu evento: torta central, bocados dulces, macarons y galletas, montada y rotulada por nuestro equipo.',
      ['1774660811156-af780020091c', 'Mesa de dulces en tonos tierra con torta central'],
      ['Bodas', 'Baby showers', 'Cumpleaños', 'Lanzamientos de marca'],
      'Incluye: diseño de la mesa, bases y bandejas, rotulación y montaje.'),
  ]),
  pasosEtiqueta: 'Paso a paso',
  pasosTitulo: titular(['Cómo', 'pedir']),
  pasosTexto: 'Pedir tu postre es sencillo: cuéntanos la idea y nosotros nos encargamos del resto.',
  pasos: keyed('paso', [
    tyt('Nos cuentas tu idea', 'Sabores, colores, número de porciones y la fecha. Puedes enviarnos fotos de referencia.'),
    tyt('Te enviamos la propuesta', 'Te respondemos por WhatsApp con opciones, precio y fecha de entrega.'),
    tyt('Horneamos a mano', 'Preparamos tu pedido desde cero, con mantequilla, cacao y frutas de la región.'),
    tyt('Recoges o te lo llevamos', 'Entregamos en Pereira y el Eje Cafetero, o lo recoges en nuestro obrador.'),
  ]),
  finalTitulo: titular(['Pide tu postre a la medida']),
  finalTexto: 'Recomendamos pedir con al menos 5 días de anticipación.',
  finalBoton: 'Diseñar mi pedido',
  seo: seo('Repostería por encargo · Cocoa', 'Tortas, postres individuales, galletas y mesas de dulces horneados a mano en Pereira. Pedidos personalizados para tu celebración.'),
};

/* ------------------------------------------------------------------ galería */

const galeria = {
  _id: 'galeria',
  _type: 'galeria',
  etiqueta: 'Galería',
  titulo: titular(['El amor'], ['', 'es dulce']),
  texto: 'Tortas, postres individuales, galletas y mesas de dulces horneados a mano con mantequilla, cacao y frutas de la región. Toca cualquier foto para ver el detalle.',
  filtroTodo: 'Todo',
  botonPedir: 'Pedir algo así',
  contadorUno: 'creación',
  contadorVarios: 'creaciones',
  finalEtiqueta: 'Pedidos personalizados',
  finalTitulo: titular(['¿Tienes una idea?'], ['', 'La horneamos.']),
  finalTexto: 'Cuéntanos sabores, colores, número de porciones y la fecha. Te respondemos por WhatsApp con opciones y precio. Recomendamos pedir con al menos 5 días de anticipación.',
  finalBoton: 'Diseñar mi pedido',
  finalFoto: photo('1777647322811-af273ac27c29', 1000, 'Masa de chocolate vertiéndose en un molde para hornear'),
  seo: seo('Galería de repostería · Cocoa', 'Galería de tortas, postres individuales, galletas y mesas de dulces horneados a mano en Pereira por Cocoa.'),
};

/* ----------------------------------------------------------------- nosotros */

const momento = (anio, titulo, texto, id, alt) => ({ _type: 'momento', anio, titulo, texto, foto: photo(id, 900, alt) });
const valor = (icono, titulo, texto) => ({ _type: 'valor', icono, titulo, texto });

const nosotros = {
  _id: 'nosotros',
  _type: 'nosotros',
  etiqueta: 'Nosotros',
  titulo: titular(['Cómo empezó'], ['', 'este sueño']),
  texto: 'Cocoa nació entre recetas familiares, hornos prestados y muchas ganas de reunir a la gente alrededor de una buena mesa. Esta es nuestra historia, contada por momentos.',
  momentos: keyed('momento', [
    momento('2012', 'La cocina de la abuela', 'Los domingos se horneaba pan de queso y torta negra. Ahí aprendimos que una receta es, sobre todo, una excusa para reunirse.', '1635341814289-55cf1490024c', 'Pan artesanal espolvoreado con harina'),
    momento('2017', 'Los primeros pedidos', 'Una torta para el cumpleaños de una amiga se convirtió en diez pedidos al mes. Horneábamos de noche, después del trabajo.', '1517427294546-5aa121f68e8a', 'Torta de chocolate en porciones junto a un tenedor'),
    momento('2019', 'Nuestra primera boda', 'Ciento veinte invitados, un horno prestado y la certeza de que esto era lo que queríamos hacer el resto de la vida.', '1525257831700-183b9b8bf5c4', 'Torta de bodas blanca de varios pisos con flores'),
    momento('2021', 'El obrador propio', 'Abrimos nuestra propia cocina de producción y sumamos el catering salado al menú. Nació oficialmente Cocoa.', '1761095596588-e85f6a028894', 'Dos cocineros preparando comida en una cocina profesional'),
    momento('2023', 'La mesa llega a tu casa', 'Lanzamos el servicio de chef privado: cenas de varios tiempos en la cocina de nuestros clientes.', '1775513153018-0c7ac7899751', 'Chef emplatando con pinzas un plato gourmet'),
    momento('Hoy', 'Un equipo, el mismo sueño', 'Somos un equipo que cocina para bodas, empresas y cenas íntimas, con la misma receta del principio: hacerlo todo con las manos.', '1561940329-7382e6704231', 'Bollería variada en bandejas de cerámica'),
  ]),
  equipoEtiqueta: 'Las manos detrás de Cocoa',
  equipoTitulo: titular(['Un equipo'], ['', 'pequeño y apasionado']),
  equipoTexto: 'Cocineros, pasteleros y anfitriones que disfrutan tanto como tú cuando una mesa queda perfecta.',
  valoresEtiqueta: 'Lo que nos mueve',
  valoresTitulo: titular(['Nuestros', 'valores']),
  valores: keyed('valor', [
    valor('gorro', 'Hecho a mano', 'Nada sale de una caja. Cada masa, salsa y relleno se prepara en nuestro obrador.'),
    valor('hoja', 'De la región', 'Compramos café, frutas y lácteos a productores del Eje Cafetero.'),
    valor('reloj', 'Sin afanes', 'Aceptamos pocos eventos por fecha para dedicarle a cada uno el tiempo que merece.'),
    valor('corazon', 'Cercanía', 'Te escuchamos de verdad: tu evento se diseña contigo, no para ti.'),
  ]),
  valoresBoton: 'Escribamos el siguiente capítulo juntos',
  seo: seo('Nosotros · La historia de Cocoa', 'Cocoa nació entre recetas familiares y hornos prestados. Conoce nuestra historia, el equipo y los valores con los que cocinamos.'),
};

/* ----------------------------------------------------------------- contacto */

const opcion = (texto, detalle, icono) => ({ _type: 'opcion', texto, detalle, icono });
const preguntaOpciones = (titulo, ayuda, opciones) => ({ _type: 'preguntaOpciones', titulo, ayuda, opciones: keyed('opcion', opciones) });

const contacto = {
  _id: 'contacto',
  _type: 'contacto',
  titulo: 'Cuéntanos tu evento',
  texto: '7 preguntas rápidas. Al final te mostramos el mensaje y lo envías por WhatsApp.',
  respuestasTitulo: 'Tu evento hasta ahora',
  respuestasVacio: 'Aquí irán apareciendo tus respuestas.',
  opciones: keyed('pregunta', [
    preguntaOpciones('¿Qué estás buscando?', 'Elige la opción que más se parezca a lo que tienes en mente.', [
      opcion('Catering', 'Menú completo para tu evento', 'cloche'),
      opcion('Repostería', 'Tortas, postres y mesas de dulces', 'cake'),
      opcion('Chef privado', 'Una cena especial en tu casa', 'hat'),
      opcion('No estoy seguro', 'Te ayudamos a decidir', 'question'),
    ]),
    preguntaOpciones('¿Qué tipo de ocasión es?', 'Así sabemos el tono y el estilo de la propuesta.', [
      opcion('Boda', 'Matrimonio, pedida o aniversario', 'rings'),
      opcion('Cumpleaños', 'De 1 a 100 años', 'balloon'),
      opcion('Evento corporativo', 'Reuniones, lanzamientos, fin de año', 'briefcase'),
      opcion('Reunión íntima', 'Cena o encuentro en casa', 'wine'),
      opcion('Otro', 'Cuéntanos más adelante', 'sparkle'),
    ]),
    preguntaOpciones('¿Para cuántas personas?', 'Un aproximado está perfecto.', [
      opcion('Hasta 10', 'Algo íntimo', 'p1'),
      opcion('11–30', 'Reunión mediana', 'p2'),
      opcion('31–80', 'Celebración grande', 'p3'),
      opcion('Más de 80', 'Gran evento', 'p4'),
    ]),
  ]),
  fecha: {
    titulo: '¿Qué fecha tienes en mente?',
    ayuda: 'Si aún no es seguro, no pasa nada: podemos ayudarte a elegirla.',
    elegir: 'Elegir fecha',
    sinFecha: 'Aún no la defino',
    sinFechaDetalle: 'Te sugerimos fechas disponibles.',
  },
  lugar: {
    titulo: '¿En qué ciudad o lugar será?',
    ayuda: 'Ciudad, barrio, finca o salón. Atendemos todo el Eje Cafetero.',
    ejemplo: 'Ej: Finca en Santa Rosa de Cabal',
    ciudades: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'Armenia', 'Manizales'],
  },
  notas: {
    titulo: '¿Algo que debamos saber?',
    ayuda: 'Gustos, restricciones alimentarias (vegetariano, sin gluten, alergias), colores o la idea que tengas.',
    ejemplo: 'Ej: Somos 4 vegetarianos. Nos encanta el maracuyá y queremos una mesa de dulces en tonos tierra.',
  },
  nombre: {
    titulo: '¿Cómo te llamas?',
    ayuda: 'Para saber con quién vamos a hablar.',
    ejemplo: 'Tu nombre',
  },
  // Rendered as "¡Gracias, {nombre}! " + resumenTitulo (see the field description in the schema).
  resumenTitulo: 'Este es tu evento',
  resumenTexto: 'Revisa tus respuestas. Al tocar el botón se abre WhatsApp con este mensaje listo para enviar.',
  saludo: 'Hola, Cocoa. Soy {nombre} y quiero cotizar un evento.',
  despedida: 'Quedo pendiente de su propuesta. ¡Gracias!',
  // quiz.js button and label texts.
  interfaz: {
    paso: 'Paso {n} de {total}',
    resumen: 'Resumen',
    atras: 'Atrás',
    pregunta: 'Pregunta',
    opcional: 'Opcional',
    ultima: 'Última',
    siguiente: 'Siguiente',
    omitir: 'Omitir',
    verResumen: 'Ver resumen',
    todoListo: 'Todo listo',
    editar: 'Editar',
    vistaPrevia: 'Vista previa del mensaje',
    enviar: 'Enviar por WhatsApp',
    horario: 'Te respondemos en horario de 8:00 a. m. a 6:00 p. m.',
    servicio: 'Servicio',
    ocasion: 'Ocasión',
    personas: 'Personas',
    fecha: 'Fecha',
    lugar: 'Lugar',
    detalles: 'Detalles',
    sinDetalles: 'Sin detalles adicionales',
    nombre: 'Nombre',
  },
  seo: seo('Cotiza tu evento · Cocoa', 'Responde 7 preguntas rápidas y envíanos tu evento por WhatsApp. Te respondemos con una propuesta hecha para ti.'),
};

/* --------------------------------------------------------------- categorías */

// gallery.js CATS (name) + FILTERS (order and pill label); nombreCorto = label on the home cards.
const CATEGORIAS = [
  ['tortas', 'Tortas', 'Tortas'],
  ['individuales', 'Postres individuales', 'Individual'],
  ['galletas', 'Galletas', 'Galletas'],
  ['mesas', 'Mesas de dulces', 'Mesas'],
  ['personalizados', 'Personalizados', undefined, 'Pedidos personalizados'],
];
const categorias = CATEGORIAS.map(([id, nombre, nombreCorto, nombreFiltro], i) => ({
  _id: `categoria-${id}`,
  _type: 'categoria',
  nombre,
  ...(nombreCorto ? { nombreCorto } : {}),
  ...(nombreFiltro ? { nombreFiltro } : {}),
  orden: i + 1,
}));

/* ------------------------------------------------------------------ postres */

// gallery.js ITEMS, in gallery order.
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

// Home "Los favoritos de la casa" cards, in home order: [photo id, home name, home alt, category for home-only items].
const FAVORITOS = [
  ['1606890737304-57a1ca8a5b62', 'Torta de chocolate y arequipe', 'Torta de chocolate de tres capas con crema y cerezas'],
  ['1774988867972-98caecc776d8', 'Cheesecake de maracuyá', 'Porción de cheesecake con fruta encima'],
  ['1620980776848-84ac10194945', 'Tartaletas de frutos rojos', 'Tarta de fresas y arándanos sobre una mesa de madera'],
  ['1499636136210-6f4ee915583e', 'Galletas de mantequilla', 'Galletas horneadas con chips de chocolate en primer plano'],
  ['1702925614886-50ad13c88d3f', 'Torta tres leches', 'Porción de torta cremosa servida en un plato'],
  ['1558326567-98ae2405596b', 'Macarons de café', 'Macarons sobre una mesa', 'mesas'],
  ['1636743715220-d8f8dd900b87', 'Brownies con nueces', 'Brownies apilados sobre un plato blanco'],
  ['1558024920-b41e1887dc32', 'Alfajores de maicena', 'Tres dulces rellenos apilados'],
];

const postres = ITEMS.map((x, i) => {
  const [alto, arcoFlag] = x.shape.split(' ');
  const fav = FAVORITOS.find(([id]) => id === x.id);
  const favIndex = FAVORITOS.indexOf(fav);
  return {
    _id: `postre-${slugify(x.name)}`,
    _type: 'postre',
    nombre: x.name,
    // Gallery tiles use alt=""; the lightbox uses the name. Home cards carry a descriptive alt.
    foto: photo(x.id, 1200, fav ? fav[2] : x.name),
    categoria: ref(`categoria-${x.cat}`),
    descripcion: x.desc,
    detalle: x.detail,
    alto,
    arco: arcoFlag === 'r',
    destacado: !!fav,
    ...(fav && fav[1] !== x.name ? { nombreInicio: fav[1] } : {}),
    ...(fav ? { ordenInicio: favIndex + 1 } : {}),
    enGaleria: true,
    orden: i + 1,
  };
});
// Home-only favorites (not in the gallery today), e.g. Macarons de café.
FAVORITOS.forEach(([id, nombre, alt, cat], favIndex) => {
  if (ITEMS.some((x) => x.id === id)) return;
  postres.push({
    _id: `postre-${slugify(nombre)}`,
    _type: 'postre',
    nombre,
    foto: photo(id, 700, alt),
    categoria: ref(`categoria-${cat}`),
    alto: 't2',
    arco: false,
    destacado: true,
    ordenInicio: favIndex + 1,
    enGaleria: false,
    orden: postres.length + 1,
  });
});

/* ------------------------------------------------------------------ equipo */

const miembros = [
  ['[Nombre de la fundadora]', 'Fundadora · Pastelera', 'Aprendió a hornear con su abuela y convirtió esa herencia en Cocoa. Diseña cada torta y cada mesa de dulces.'],
  ['[Nombre del chef]', 'Chef de cocina', 'Responsable del catering salado y del servicio de chef privado. Le encanta cocinar con producto de temporada.'],
  ['[Nombre de la coordinadora]', 'Coordinadora de eventos', 'Tu contacto desde el primer mensaje hasta el día del evento. Se asegura de que todo llegue a tiempo y a la perfección.'],
].map(([nombre, cargo, bio], i) => ({ _id: `miembro-${i + 1}`, _type: 'miembro', nombre, cargo, bio, orden: i + 1 }));

const ALL_DOCS = [ajustes, inicio, catering, reposteria, galeria, nosotros, contacto, ...categorias, ...postres, ...miembros];
// --only=id1,id2 limits the run to those documents (e.g. --only=reposteria), leaving the rest untouched.
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const DOCS = ONLY ? ALL_DOCS.filter((d) => ONLY.includes(d._id)) : ALL_DOCS;

/* ------------------------------------------------------------------ images */

const sourceUrl = (id, w) => `https://images.unsplash.com/photo-${id}?fm=jpg&fit=crop&w=${w}&q=80`;
const filenameFor = (id) => `unsplash-${id}.jpg`;

/** Walks a value, replacing every image placeholder through `fn` (keeps _key on array items). */
const mapImages = (value, fn) => {
  if (Array.isArray(value)) return value.map((v) => mapImages(v, fn));
  if (value && typeof value === 'object') {
    if (value[IMG]) return fn(value);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapImages(v, fn)]));
  }
  return value;
};

/** Largest width requested per photo, so one upload serves every use of the same photo. */
const collectWidths = () => {
  const widths = new Map();
  mapImages(DOCS, (p) => { widths.set(p.id, Math.max(widths.get(p.id) || 0, p.w)); return p; });
  return widths;
};

const fotoValue = (p, extra) => {
  const { _key } = p;
  return { ...(_key ? { _key } : {}), _type: 'foto', alt: p.alt, ...extra };
};

/* --------------------------------------------------------------------- run */

async function main() {
  const widths = collectWidths();

  if (DRY_RUN) {
    const docs = mapImages(DOCS, (p) => fotoValue(p, { _sourceUrl: sourceUrl(p.id, widths.get(p.id)) }));
    process.stdout.write(`${JSON.stringify(docs, null, 2)}\n`);
    return;
  }

  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_WRITE_TOKEN;
  const missing = [!projectId && 'PUBLIC_SANITY_PROJECT_ID', !token && 'SANITY_WRITE_TOKEN'].filter(Boolean);
  if (missing.length) {
    console.error(`Error: faltan variables de entorno: ${missing.join(', ')}.\n`
      + 'Agrégalas en .env.local (el token debe tener permiso de escritura, "Editor") y ejecuta: npm run seed\n'
      + 'Para ver los datos sin conectarte a Sanity usa: node scripts/seed.mjs --dry-run');
    process.exit(1);
  }

  const { createClient } = await import('@sanity/client');
  const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false });

  const assets = new Map(); // photo id → asset _id (cache within this run)
  let reused = 0, uploaded = 0;
  for (const [id, w] of widths) {
    const filename = filenameFor(id);
    const existing = await client.fetch('*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id', { f: filename });
    if (existing) { assets.set(id, existing); reused++; continue; }
    const url = sourceUrl(id, w);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No se pudo descargar la foto ${url} (HTTP ${res.status}).`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' });
    assets.set(id, asset._id);
    uploaded++;
    console.log(`Foto subida: ${filename}`);
  }
  console.log(`Fotos: ${uploaded} subidas, ${reused} reutilizadas.`);

  const docs = mapImages(DOCS, (p) => fotoValue(p, { asset: ref(assets.get(p.id)) }));
  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();
  console.log(`Listo: ${docs.length} documentos creados o actualizados en "${dataset}".`);
}

main().catch((err) => {
  console.error(`Error durante la importación: ${err.message}`);
  process.exit(1);
});
