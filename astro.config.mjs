// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  markdown: {
    processor: unified({ remarkPlugins: [remarkBreaks] })
  },

  vite: {
    plugins: [tailwindcss()]
  }
});