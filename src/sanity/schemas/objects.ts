import { defineArrayMember, defineField, defineType } from 'sanity';

/** Photo with a required description (used by screen readers and Google). */
export const foto = defineType({
  name: 'foto',
  title: 'Foto',
  type: 'image',
  options: { hotspot: true },
  description: 'Sube una foto. Con el botón del lápiz puedes elegir el punto que nunca se debe recortar.',
  fields: [
    defineField({
      name: 'alt',
      title: 'Descripción de la foto',
      type: 'string',
      description: 'Describe en una frase qué se ve. Ej: "Torta de chocolate con fresas". Ayuda a personas ciegas y a Google.',
      validation: (r) => r.required().warning('Agrega una descripción corta de la foto.'),
    }),
  ],
});

/** A heading split into lines; each line can end with a highlighted (italic) part. */
export const titular = defineType({
  name: 'titular',
  title: 'Título',
  type: 'object',
  description: 'El título se muestra en líneas. En cada línea, el "texto resaltado" aparece en cursiva y con color.',
  fields: [
    defineField({
      name: 'lineas',
      title: 'Líneas del título',
      type: 'array',
      validation: (r) => r.required().min(1).max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'linea',
          title: 'Línea',
          fields: [
            defineField({ name: 'texto', title: 'Texto normal', type: 'string' }),
            defineField({ name: 'resaltado', title: 'Texto resaltado (cursiva)', type: 'string', description: 'Opcional. Se muestra después del texto normal.' }),
          ],
          preview: {
            select: { texto: 'texto', resaltado: 'resaltado' },
            prepare: ({ texto, resaltado }) => ({ title: [texto, resaltado && `«${resaltado}»`].filter(Boolean).join(' ') }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { lineas: 'lineas' },
    prepare: ({ lineas }) => ({ title: (lineas || []).map((l: { texto?: string; resaltado?: string }) => [l.texto, l.resaltado].filter(Boolean).join(' ')).join(' / ') }),
  },
});

/** A paragraph-style sentence ending with a highlighted part. */
export const frase = defineType({
  name: 'frase',
  title: 'Frase',
  type: 'object',
  fields: [
    defineField({ name: 'texto', title: 'Texto normal', type: 'text', rows: 3 }),
    defineField({ name: 'resaltado', title: 'Final resaltado (cursiva y color)', type: 'string', description: 'Opcional. Se muestra al final de la frase.' }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'Google y redes sociales',
  type: 'object',
  description: 'Así aparece esta página en Google y cuando se comparte por WhatsApp.',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'titulo', title: 'Título en Google', type: 'string', validation: (r) => r.max(70).warning('Mejor menos de 70 letras.') }),
    defineField({ name: 'descripcion', title: 'Descripción en Google', type: 'text', rows: 3, validation: (r) => r.max(170).warning('Mejor menos de 170 letras.') }),
  ],
});

export const tituloYTexto = defineType({
  name: 'tituloYTexto',
  title: 'Título y texto',
  type: 'object',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string' }),
    defineField({ name: 'texto', title: 'Texto', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'titulo', subtitle: 'texto' } },
});

export const objectTypes = [foto, titular, frase, seo, tituloYTexto];
