const postcss = require('rollup-plugin-postcss');
const replace = require('@rollup/plugin-replace');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  rollup(config) {
    config.external = [
      'clsx',
      'react',
      'motion',
      'react-dom',
      'tailwindcss',
      'autoprefixer',
      'react/jsx-runtime',
      '@stellar/freighter-api',
      '@lobstrco/signer-extension-api',
      '@creit.tech/xbull-wallet-connect',
    ];
    config.plugins.push(
      replace({
        preventAssignment: true,
      }),
      postcss({
        config: {
          path: './postcss.config.js',
        },
        plugins: [tailwindcss(), autoprefixer()],
        extensions: ['.css'],
        extract: false,
        inject: 'true',
        minimize: true,
      }),
    );

    return config;
  },
};
