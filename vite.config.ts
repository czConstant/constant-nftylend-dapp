import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import alias from '@rollup/plugin-alias';
import inject from '@rollup/plugin-inject';
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default ({ mode}) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_');
  return defineConfig({
    plugins: [
      alias(),
      react(),
      commonjs(),
      // inject({ Buffer: ['buffer', 'Buffer'] }),
    ],
    resolve: {
      alias: {
        'src': path.resolve(__dirname, 'src'),
        crypto: 'crypto-js',
        fs: require.resolve('rollup-plugin-node-builtins'),
      }
    },
    server: {
      port: 3001,
    },
    define: {
      "global": {},
      "process.env.NODE_DEBUG": JSON.stringify(""),
      "DOT_ENV": env,
      "__CLIENT__": true,
    },
    optimizeDeps: {
      exclude: [
        // 'buffer',
      ]
    },
    build: {
      outDir: `./dist${env.REACT_BASE_PATH}/`,
      assetsDir: `.${env.REACT_BASE_PATH}/assets/`,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('react-custom-scrollbars-2')) return 'react-custom-scrollbars-2';
            if (id.includes('moment')) return 'moment';
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('bignumber')) return 'bignumber.js';
            if (id.includes('axios')) return 'axios';
            if (id.includes('node_modules')) return 'vendor';
          }
        }
      }
    },
  })
};
