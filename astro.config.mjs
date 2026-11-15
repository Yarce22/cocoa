import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_');

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID || 'placeholder', // lets the build run before keys exist; src/lib/sanity.ts skips fetching then
      dataset: PUBLIC_SANITY_DATASET || 'production',
      useCdn: false, // static build: always read fresh content at build time
      apiVersion: '2025-01-01',
      studioBasePath: '/admin',
    }),
    react(),
  ],
});
