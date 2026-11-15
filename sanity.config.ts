import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';
import { structure, singletonTypes } from './src/sanity/structure';

export default defineConfig({
  name: 'cocoa',
  title: 'Cocoa · Administración',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool({ title: 'Contenido', structure })],
  schema: {
    types: schemaTypes,
    // singletons cannot be created again from the "new document" menu
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType) ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : actions,
  },
});
