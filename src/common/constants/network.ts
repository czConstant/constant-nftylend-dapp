import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { APP_CLUSTER } from './config';

export const ChainPolygonID = APP_CLUSTER === 'mainnet' ? '' : '0x13881';
export const ChainSolanaNetwork = APP_CLUSTER === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;