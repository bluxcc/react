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
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  onwarn(warning, warn) {
    // Suppress "Module level directives" warnings
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
      return;
    }

    // Call the default warning handler for other warnings
    warn(warning);
  },
  watch: {
    clearScreen: false, // Avoid clearing the terminal screen on each rebuild
    include: 'src/**', // Watch all files in the "src" directory
    exclude: 'node_modules/**', // Don't watch files in node_modules
  },
};
