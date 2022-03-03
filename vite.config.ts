import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import alias from '@rollup/plugin-alias';
import inject from '@rollup/plugin-inject';
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default ({ mode}) => defineConfig({
  plugins: [
    inject({ Buffer: ['buffer', 'Buffer'] }),
    alias(),
    react(),
    commonjs({
      exclude: 'borsh',
    }),
  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      crypto: 'crypto-js',
      fs: require.resolve('rollup-plugin-node-builtins'),
    }
  },
  define: {
    "global": {},
    "process.env.NODE_DEBUG": JSON.stringify(""),
    "DOT_ENV": loadEnv(mode, process.cwd(), 'REACT_'),
    "__CLIENT__": true,
  },
  optimizeDeps: {
    include: [
      'buffer',
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
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
