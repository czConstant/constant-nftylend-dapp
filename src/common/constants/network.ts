import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { APP_CLUSTER } from './config';

export enum Chain {
  None = '',
  Solana = 'SOL',
  Polygon = 'MATIC',
};

export const ChainPolygonID = APP_CLUSTER === 'mainnet' ? '' : 80001;
export const ChainSolanaNetwork = APP_CLUSTER === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;