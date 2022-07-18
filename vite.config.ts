import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import alias from '@rollup/plugin-alias';
import inject from '@rollup/plugin-inject';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default ({ mode}) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_');
  const production = process.env.NODE_ENV === 'production';
  const version = new Date().getTime();
  
  return defineConfig({
    plugins: [
      alias(),
      react(),
      // commonjs(),
      // inject({ Buffer: ['buffer', 'Buffer'] }),
      !production && nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
      })
    ],
    resolve: {
      alias: {
        'src': path.resolve(__dirname, 'src'),
        crypto: 'crypto-js',
        fs: require.resolve('rollup-plugin-node-builtins'),
        web3: path.resolve(__dirname, './node_modules/web3/dist/web3.min.js'),
      }
    },
    define: {
      "global": "window",
      "process.env.NODE_DEBUG": JSON.stringify(""),
      "DOT_ENV": env,
      "__CLIENT__": true,
    },
    optimizeDeps: {
      // include: [
      //   'buffer',
      // ]
    },
    build: {
      outDir: `./dist${env.REACT_BASE_PATH}/`,
      assetsDir: `.${env.REACT_BASE_PATH}/assets/`,
      rollupOptions: {
        plugins: [
          nodePolyfills(),
        ],
        output: {
          manualChunks(id) {
            if (id.includes('react-custom-scrollbars-2')) return 'react-custom-scrollbars-2';
            if (id.includes('moment')) return 'moment';
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('axios')) return 'axios';
            if (id.includes('node_modules')) return `vendor_${version}`;
          }
        }
      },
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
  })
};
