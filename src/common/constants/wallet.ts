import { ethers } from 'ethers';

export enum CryptoWallet {
  None = '',
  Metamask = 'metamask',
  BinanceWallet = 'binanceWallet',
  CoinbaseWallet = 'coinbaseWallet',
  FrameWallet = 'frameWallet',
  CloverWallet = 'cloverWallet',
  WalletConnect = 'walletConnect',
  Coin98 = 'coin98',
};

export type EvmProvider = ethers.providers.Web3Provider;

export const getEvmProvider = (wallet?: CryptoWallet): EvmProvider => {
  if (window.evmProvider) return window.evmProvider;
  if (!window.ethereum) {
    throw new Error('Metamask not installed');
  }
  let provider = window.ethereum;
  if (!window.ethereum.providers) return new ethers.providers.Web3Provider(provider);
  // if (wallet === CryptoWallet.Coin98) {
  //   if (!window.coin98) {
  //     throw new Error('Coin98 Wallet Extension not installed');
  //   }
  //   provider = window.coin98;
  // }
  try {
    switch (wallet) {
      case CryptoWallet.BinanceWallet:
        if (!window.BinanceChain)
          throw new Error('Binance Wallet Extension not installed');
        provider = window.BinanceChain;
        break;
      case CryptoWallet.CoinbaseWallet:
        if (!window.ethereum.providers.find((e: any) => e.isCoinbaseWallet))
          throw new Error('Coinbase Wallet Extension not installed');
        provider = window.ethereum.providers.find((e: any) => e.isCoinbaseWallet);
        break;
      case CryptoWallet.FrameWallet:
        if (!window.ethereum.providers.find((e: any) => e.isMetaMask))
          throw new Error('Frame Wallet not installed');
        provider = window.ethereum.providers.find((e: any) => e.isMetaMask);
        break;
      case CryptoWallet.CloverWallet:
        if (!window.ethereum.providers.find((e: any) => e.isClover))
          throw new Error('Clover Wallet not installed');
        provider = window.ethereum.providers.find((e: any) => e.isClover);
        break;
      case CryptoWallet.Metamask:
        if (!window.ethereum.providers.find((e: any) => e.isMetaMask))
          throw new Error('Metamask not installed');
        provider = window.ethereum.providers.find((e: any) => e.isMetaMask);
        break;
      default:
        throw new Error('No provider');
    }
  } catch (err) {
    console.log("🚀 ~ file: wallet.ts ~ line 56 ~ getEvmProvider ~ err", err)
  }
  return new ethers.providers.Web3Provider(provider);
}