/// <reference types="@sanity/astro/module" />
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityClient } from '@sanity/client';

/* ------------------------------------------------------------------ types */
export interface Foto {
  _type?: 'foto' | 'image';
  asset?: { _ref?: string; _type?: string };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
}
export interface Linea { texto?: string; resaltado?: string }
export interface Titular { lineas?: Linea[] }
export interface Frase { texto?: string; resaltado?: string }
export interface Seo { titulo?: string; descripcion?: string }
export interface TituloYTexto { titulo?: string; texto?: string }

export interface Ajustes {
  whatsapp?: string; whatsappVisible?: string; email?: string; ciudad?: string; ciudadCorta?: string; nota?: string;
  instagram?: string; tiktok?: string; facebook?: string; usuarioRedes?: string;
  menuCatering?: string; menuReposteria?: string; menuNosotros?: string; menuInicio?: string;
  botonCotizar?: string; botonWhatsapp?: string;
  pieTitulo?: Titular; pieDescripcion?: string; pieExplora?: string; pieHablemos?: string; pieSiguenos?: string;
  pieCopyright?: string; pieFirma?: string;
}

export interface Inicio {
  portadaFotos?: Foto[]; portadaTitulo?: Titular; portadaSubtitulo?: string; portadaBoton?: string; portadaEnlace?: string;
  portadaSello?: string; portadaDesliza?: string; cinta?: string[];
  cocinaEtiqueta?: string; cocinaFrase?: Frase; cocinaPuntos?: TituloYTexto[]; cocinaFoto?: Foto; cocinaFotoPequena?: Foto;
  serviciosEtiqueta?: string; serviciosTitulo?: Titular; serviciosTexto?: string;
  serviciosTarjetas?: { _key?: string; etiqueta?: string; titulo?: string; texto?: string; foto?: Foto; enlace?: string; destino?: string }[];
  favoritosEtiqueta?: string; favoritosTitulo?: Titular; favoritosEnlace?: string;
  historiaEtiqueta?: string; historiaCita?: Frase; historiaTexto?: string; historiaEnlace?: string; historiaFoto?: Foto;
  finalTitulo?: Titular; finalTexto?: string; finalBoton?: string;
  seo?: Seo;
}

export interface Catering {
  etiqueta?: string; titulo?: Titular; texto?: string; foto?: Foto; cinta?: string[];
  serviciosTitulo?: Titular; serviciosTexto?: string; idealPara?: string;
  servicios?: { _key?: string; etiqueta?: string; titulo?: string; texto?: string; foto?: Foto; ideal?: string[]; incluye?: string }[];
  pasosEtiqueta?: string; pasosTitulo?: Titular; pasosTexto?: string; pasos?: TituloYTexto[];
  finalTitulo?: Titular; finalTexto?: string; finalBoton?: string;
  seo?: Seo;
}

export interface Reposteria {
  etiqueta?: string; titulo?: Titular; texto?: string; filtroTodo?: string; botonPedir?: string;
  finalEtiqueta?: string; finalTitulo?: Titular; finalTexto?: string; finalBoton?: string; finalFoto?: Foto;
  seo?: Seo;
}

export interface Nosotros {
  etiqueta?: string; titulo?: Titular; texto?: string;
  momentos?: { _key?: string; anio?: string; titulo?: string; texto?: string; foto?: Foto }[];
  equipoEtiqueta?: string; equipoTitulo?: Titular; equipoTexto?: string;
  valoresEtiqueta?: string; valoresTitulo?: Titular;
  valores?: { _key?: string; icono?: 'gorro' | 'hoja' | 'reloj' | 'corazon'; titulo?: string; texto?: string }[];
  valoresBoton?: string;
  seo?: Seo;
}

export interface Pregunta { titulo?: string; ayuda?: string }
export interface Contacto {
  titulo?: string; texto?: string; respuestasTitulo?: string; respuestasVacio?: string;
  opciones?: (Pregunta & { opciones?: { texto?: string; detalle?: string; icono?: string }[] })[];
  fecha?: Pregunta & { elegir?: string; sinFecha?: string; sinFechaDetalle?: string };
  lugar?: Pregunta & { ejemplo?: string; ciudades?: string[] };
  notas?: Pregunta & { ejemplo?: string };
  nombre?: Pregunta & { ejemplo?: string };
  resumenTitulo?: string; resumenTexto?: string; saludo?: string; despedida?: string;
  seo?: Seo;
}

export interface Categoria { _id: string; nombre?: string; nombreCorto?: string; orden?: number }
export interface Postre {
  _id: string; nombre?: string; foto?: Foto; categoria?: Categoria | null; descripcion?: string; detalle?: string;
  alto?: 't1' | 't2' | 't3'; arco?: boolean; destacado?: boolean; nombreInicio?: string; orden?: number;
}
export interface Miembro { _id: string; nombre?: string; cargo?: string; bio?: string; foto?: Foto; orden?: number }

export interface Pages { inicio: Inicio; catering: Catering; reposteria: Reposteria; nosotros: Nosotros; contacto: Contacto }

/* ----------------------------------------------------------------- client */
const projectId: string | undefined = import.meta.env.PUBLIC_SANITY_PROJECT_ID || undefined;
const dataset: string = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

/**
 * Without a project id (local dev before the keys exist) every helper returns empty content so
 * `astro build` still works. With a project id, any fetch error propagates and fails the build.
 */
export const sanityEnabled = Boolean(projectId);

let client: Promise<SanityClient> | undefined;
// Imported lazily: the virtual module creates the client eagerly and throws without a project id.
const getClient = () => (client ??= import('sanity:client').then((m) => m.sanityClient));

const cache = new Map<string, Promise<unknown>>();
function query<T>(groq: string, params: Record<string, unknown>, empty: T): Promise<T> {
  if (!sanityEnabled) return Promise.resolve(empty);
  const key = groq + JSON.stringify(params);
  if (!cache.has(key)) cache.set(key, getClient().then((c) => c.fetch<T | null>(groq, params)).then((r) => r ?? empty));
  return cache.get(key) as Promise<T>;
}

/* ---------------------------------------------------------------- helpers */
export const getSettings = () => query<Ajustes | null>('*[_id == "ajustes"][0]', {}, null);

export const getPage = <K extends keyof Pages>(type: K) =>
  query<Pages[K] | null>('*[_id == $id][0]', { id: type }, null);

const CATEGORIA = '{ _id, nombre, nombreCorto, orden }';

export const getCategories = () =>
  query<Categoria[]>(`*[_type == "categoria"] | order(orden asc, nombre asc) ${CATEGORIA}`, {}, []);

export const getDesserts = () =>
  query<Postre[]>(
    `*[_type == "postre"] | order(orden asc, nombre asc) { _id, nombre, foto, descripcion, detalle, alto, arco, destacado, nombreInicio, orden, "categoria": categoria->${CATEGORIA} }`,
    {},
    [],
  );

export const getTeam = () =>
  query<Miembro[]>('*[_type == "miembro"] | order(orden asc, nombre asc) { _id, nombre, cargo, bio, foto, orden }', {}, []);

/* ----------------------------------------------------------------- images */
const builder = createImageUrlBuilder({ projectId: projectId ?? 'missing', dataset });

export const hasImage = (img?: Foto | null): img is Foto => Boolean(img?.asset?._ref);

/** Sanity CDN URL; crops to the hotspot when both width and height are given. */
export function urlFor(img: Foto | null | undefined, w: number, h?: number): string {
  if (!hasImage(img)) return '';
  let b = builder.image(img).width(w).auto('format').quality(70);
  if (h) b = b.height(h).fit('crop');
  return b.url();
}

export const srcsetFor = (img: Foto | null | undefined, widths: number[]) =>
  hasImage(img) ? widths.map((w) => `${urlFor(img, w)} ${w}w`).join(', ') : '';

/** JSON for `<script type="application/json">`, safe against `</script>` injection. */
export const jsonForScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
