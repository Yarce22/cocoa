#!/usr/bin/env node
/**
 * One-time migration: the old repostería page (photo gallery) becomes the new "galeria" page.
 *
 *   npm run migrate:galeria            → copies the live "reposteria" texts into "galeria" and adds the
 *                                        "Galería" menu label; then run: npm run seed -- --only=reposteria
 *   npm run migrate:galeria -- --dry-run → prints what it would write, writes nothing
 *
 * Safe to re-run: it never overwrites an existing "galeria" document or menu label.
 */

const DRY_RUN = process.argv.includes('--dry-run');
const GALLERY_FIELDS = ['etiqueta', 'titulo', 'texto', 'filtroTodo', 'botonPedir', 'contadorUno', 'contadorVarios',
  'finalEtiqueta', 'finalTitulo', 'finalTexto', 'finalBoton', 'finalFoto'];

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('Error: faltan PUBLIC_SANITY_PROJECT_ID o SANITY_WRITE_TOKEN en .env.local.');
  process.exit(1);
}

const { createClient } = await import('@sanity/client');
const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false });

const [old, existing] = await Promise.all([client.getDocument('reposteria'), client.getDocument('galeria')]);
const tx = client.transaction();

if (existing) {
  console.log('"galeria" ya existe: no se toca.');
} else if (!old || !('filtroTodo' in old)) {
  console.log('"reposteria" ya no tiene los textos de la galería: nada que copiar.');
} else {
  const galeria = { _id: 'galeria', _type: 'galeria' };
  for (const k of GALLERY_FIELDS) if (old[k] !== undefined) galeria[k] = old[k];
  galeria.seo = { _type: 'seo', titulo: 'Galería de repostería · Cocoa', descripcion: 'Galería de tortas, postres individuales, galletas y mesas de dulces horneados a mano en Pereira por Cocoa.' };
  tx.createIfNotExists(galeria);
  console.log('Se creará "galeria" con los textos actuales de repostería.');
}
tx.patch('ajustes', (p) => p.setIfMissing({ menuGaleria: 'Galería' }));

if (DRY_RUN) {
  console.log(JSON.stringify(tx.serialize(), null, 2));
} else {
  await tx.commit();
  console.log('Listo. Ahora ejecuta: npm run seed -- --only=reposteria');
}
