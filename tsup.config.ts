import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string };

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'accessibility/index': 'src/accessibility/index.ts',
      'tour/index': 'src/tour/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    platform: 'browser',
    treeshake: true,
    splitting: false,
    minify: false,
  },
  {
    entry: {
      'cli/index': 'src/cli/index.ts',
    },
    format: ['esm'],
    dts: false,
    sourcemap: true,
    target: 'node18',
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node',
    },
    define: {
      '__PKG_VERSION__': JSON.stringify(version),
    },
    treeshake: true,
    splitting: false,
    minify: false,
  },
]);
