import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  treeshake: {
    moduleSideEffects: false,
  },
  plugins: [
    peerDepsExternal(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    postcss({
      extract: false,
      inject: true,
      minimize: true,
      sourceMap: true,
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['node_modules', 'motion'],
    }),
  ],
  external: [
    'react',
    'react-dom',
    'motion',
    'node_modules/motion',
    '@albedo-link/intent',
    '@stellar/freighter-api',
    '@lobstrco/signer-extension-api',
    '@creit.tech/xbull-wallet-connect',
  ],
};
