import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import tailwindcss from '@tailwindcss/postcss';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  preserveEntrySignatures: 'strict',
  plugins: [
    alias({
      entries: [
        {
          find: 'global',
          replacement: 'globalThis',
        }
      ]
    }),
    json(),
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    postcss({
      extract: false,
      inject: true,
      minimize: false,
      sourceMap: true,
      plugins: [tailwindcss],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      target: 'es2022',
      exclude: ['node_modules', 'motion'],
    }),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  watch: {
    clearScreen: false,
    include: 'src/**',
    exclude: 'node_modules/**',
  },
};
