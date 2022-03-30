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

export const PolygonChainConfig = {
  chainId: `0x${ChainPolygonID.toString(16)}`,
  chainName: APP_CLUSTER === 'mainnet' ? 'Matic mainnet' : 'Mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: APP_CLUSTER === 'mainnet' ? ['https://matic-mainnet.chainstacklabs.com'] : ['https://matic-mumbai.chainstacklabs.com'],
  blockExplorerUrls: APP_CLUSTER === 'mainnet' ? ['https://polygonscan.com/'] : ['https://mumbai.polygonscan.com'],
}

export const AvalancheChainConfig = {
  chainId: `0x${ChainAvalancheID.toString(16)}`,
  chainName: APP_CLUSTER === 'mainnet' ? 'Avalanche mainnet' : 'Fuji',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: APP_CLUSTER === 'mainnet' ? ['https://api.avax.network/ext/bc/C/rpc'] : ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: APP_CLUSTER === 'mainnet' ? ['https://snowtrace.io/'] : ['https://testnet.snowtrace.io/'],
}
