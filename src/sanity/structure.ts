import type { StructureResolver } from 'sanity/structure';

/** One fixed document per page: owners open it and edit, they never create or delete it. */
export const singletons = [
  { type: 'inicio', title: 'Página de inicio' },
  { type: 'catering', title: 'Página de catering' },
  { type: 'reposteria', title: 'Página de repostería' },
  { type: 'galeria', title: 'Página de galería' },
  { type: 'nosotros', title: 'Página de nosotros' },
  { type: 'contacto', title: 'Página del cotizador' },
] as const;

export const singletonTypes = new Set<string>(['ajustes', ...singletons.map((s) => s.type)]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido del sitio')
    .items([
      S.listItem().title('Datos generales (WhatsApp, redes, pie)').id('ajustes').child(S.document().schemaType('ajustes').documentId('ajustes').title('Datos generales')),
      S.divider(),
      ...singletons.map((s) => S.listItem().title(s.title).id(s.type).child(S.document().schemaType(s.type).documentId(s.type).title(s.title))),
      S.divider(),
      S.documentTypeListItem('postre').title('Postres'),
      S.documentTypeListItem('categoria').title('Categorías de postres'),
      S.documentTypeListItem('miembro').title('Equipo'),
    ]);
