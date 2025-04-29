import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import html from '@rollup/plugin-html';

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
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: false,
    },
  ],
  preserveEntrySignatures: 'strict',
  treeshake: true,
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
    html({
      title: 'Blux Demo',
      template: ({ attributes, files, publicPath, title }) => {
        const scripts = (files.js || [])
          .map(
            ({ fileName }) =>
              `<script src="${publicPath}${fileName}"></script>`,
          )
          .join('\n');

        const bufferScript = `
        <script type='module'>
      import { Buffer } from 'buffer';
      window.Buffer = Buffer;
      window.global = window;
    </script>
        `;

        return `<!DOCTYPE html>
    <html ${attributes.html}>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
      </head>
      <body>
        <div id="root"></div>
        ${bufferScript}
        ${scripts}
      </body>
    </html>`;
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
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['node_modules'],
    }),
  ],
  external: (id) => {
    if (['buffer'].includes(id)) return false;
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ].some((dep) => id === dep || id.startsWith(`${dep}/`));
  },
};
