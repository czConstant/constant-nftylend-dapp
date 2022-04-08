import { ethers } from 'ethers';

export enum CryptoWallet {
  None = '',
  Metamask = 'metamask',
  BinanceWallet = 'binanceWallet',
  CoinbaseWallet = 'coinbaseWallet',
};

export type EvmProvider = ethers.providers.Web3Provider;

export const getEvmProvider = (wallet?: CryptoWallet): EvmProvider => {
  if (window.evmProvider) return window.evmProvider;
  if (!window.ethereum) {
    throw new Error('Metamask not installed');
  }
  let provider = window.ethereum;
  if (wallet === CryptoWallet.BinanceWallet) {
    if (!window.BinanceChain) {
      throw new Error('Binance Wallet Extension not installed');
    }
    provider = window.BinanceChain;
  }
  if (wallet === CryptoWallet.CoinbaseWallet) {
    if (!window.ethereum.providers.find((e: any) => e.isCoinbaseWallet)) {
      throw new Error('Coinbase Wallet Extension not installed');
    }
    provider = window.ethereum.providers.find((e: any) => e.isCoinbaseWallet);
  }
  if (wallet === CryptoWallet.Metamask) {
    if (!window.ethereum.providers.find((e: any) => e.isMetaMask)) {
      throw new Error('Metamask not installed');
    }
    provider = window.ethereum.providers.find((e: any) => e.isMetaMask);
  }
  return new ethers.providers.Web3Provider(provider);
}