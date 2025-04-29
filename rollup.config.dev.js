import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import html from '@rollup/plugin-html';
import inject from '@rollup/plugin-inject';
import alias from '@rollup/plugin-alias';

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
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  preserveEntrySignatures: 'strict',
  plugins: [
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
    peerDepsExternal(),
    alias({
      entries: [
        {
          find: 'buffer',
          replacement: 'buffer/',
        },
      ],
    }),
    inject({
      Buffer: ['buffer', 'Buffer'],
    }),
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
      plugins: [tailwindcss, autoprefixer],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      target: 'es2022',
      exclude: ['node_modules', 'motion'],
    }),
  ],
  external: (id) => {
    if (['buffer'].includes(id)) return false;
    return [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ].some((dep) => id === dep || id.startsWith(`${dep}/`));
  },
  watch: {
    clearScreen: false,
    include: 'src/**',
    exclude: 'node_modules/**',
  },
};
