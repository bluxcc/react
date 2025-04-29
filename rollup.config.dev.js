import inject from '@rollup/plugin-inject';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: false,
      intro: `
        // Ensure Buffer polyfill is available globally
        import { Buffer as BufferPolyfill } from 'buffer';
        if (typeof globalThis.Buffer === 'undefined') {
          globalThis.Buffer = BufferPolyfill;
        }
      `,
      // Add the following to ensure ESM compatibility
      interop: 'auto',
      exports: 'named',
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: false,
      intro: `
        // Ensure Buffer polyfill is available globally
        var BufferPolyfill = require('buffer').Buffer;
        if (typeof globalThis.Buffer === 'undefined') {
          globalThis.Buffer = BufferPolyfill;
        }
      `,
      exports: 'named',
    },
  ],
  preserveEntrySignatures: 'strict',
  treeshake: true,
  plugins: [
    peerDepsExternal(),

    // Move inject before resolve for better support across browsers
    inject({
      Buffer: ['buffer', 'Buffer'],
      process: ['process', 'default'],
      // Use global assignment to ensure polyfill is available
      include: ['**/*.ts', '**/*.js'],
      exclude: 'node_modules/**',
    }),

    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      transformMixedEsModules: true,
      // Include buffer in the bundle
      include: /node_modules\/(buffer|process|browser-process-hrtime|events)/,
      // Ensure proper ESM conversion
      strictRequires: true,
      esmExternals: true,
    }),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['node_modules'],
    }),
    terser({
      compress: {
        drop_console: false, // Keep console during development
        drop_debugger: false,
      },
      format: {
        comments: false,
      },
    }),
  ],
  external: (id) => {
    // Ensure buffer and process are bundled
    if (['buffer', 'process', 'events'].includes(id)) return false;
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ].some((dep) => id === dep || id.startsWith(`${dep}/`));
  },
};
