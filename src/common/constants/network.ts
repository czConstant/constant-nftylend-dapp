import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { APP_CLUSTER } from './config';

export enum Chain {
  None = '',
  Solana = 'SOL',
  Polygon = 'MATIC',
  Avalanche = 'AVAX',
};

export const ChainPolygonID = APP_CLUSTER === 'mainnet' ? '' : 80001;
export const ChainAvalancheID = APP_CLUSTER === 'mainnet' ? '' : 43113;
export const ChainSolanaNetwork = APP_CLUSTER === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;

// https://docs.moralis.io/moralis-dapp/web3-sdk/supported-chains
export const MoralisChainName = {
  [Chain.Solana]: APP_CLUSTER === 'mainnet' ? 'mainnet' : 'testnet',
  [Chain.Polygon]: APP_CLUSTER === 'mainnet' ? 'matic' : 'mumbai',
  [Chain.Avalanche]: APP_CLUSTER === 'mainnet' ? 'avalanche' : '0xa869',
}