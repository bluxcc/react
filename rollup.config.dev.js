import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import polyfillNode from 'rollup-plugin-polyfill-node';
import inject from 'rollup-plugin-inject';

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: ['src/index.ts'],
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
    polyfillNode(),
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    inject({
      Buffer: ['buffer', 'Buffer'],
      global: 'globalThis',
      process: 'process',
    }),
    postcss({
      extract: false,
      inject: true,
      minimize: false,
      sourceMap: true,
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      target: 'es2022',
      exclude: ['node_modules', 'motion'],
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}).filter((dep) => dep !== 'buffer'),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  watch: {
    clearScreen: false,
    include: 'src/**',
    exclude: 'node_modules/**',
  },
};
