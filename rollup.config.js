import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    postcss({
      extract: true,
      inject: true,
      minimize: true,
      sourceMap: true,
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['node_modules/**', 'motion/dist/**'],
    }),
  ],
  external: ['react', 'react-dom', 'motion', 'framer-motion'],
};
