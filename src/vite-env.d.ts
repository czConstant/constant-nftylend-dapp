/// <reference types="vite/client" />
declare const DOT_ENV: any;
declare const __CLIENT__: boolean;
declare const __SERVER__: boolean;

interface Window {
  ethereum: any,
  BinanceChain: any,
  evmProvider: any,
}