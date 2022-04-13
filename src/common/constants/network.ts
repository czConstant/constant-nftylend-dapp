import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { APP_CLUSTER } from './config';

export enum Chain {
  None = '',
  Solana = 'SOL',
  Polygon = 'MATIC',
  Avalanche = 'AVAX',
  BSC = 'BSC',
  Boba = 'BOBA',
};

export const ChainPolygonID = APP_CLUSTER === 'mainnet' ? '' : 80001;
export const ChainAvalancheID = APP_CLUSTER === 'mainnet' ? '' : 43113;
export const ChainSolanaNetwork = APP_CLUSTER === 'mainnet' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
export const ChainBscID = APP_CLUSTER === 'mainnet' ? '' : 97;
export const ChainBobaID = APP_CLUSTER === 'mainnet' ? '' : 28;

// https://docs.moralis.io/moralis-dapp/web3-sdk/supported-chains
export const MoralisChainName = {
  [Chain.Solana]: APP_CLUSTER === 'mainnet' ? 'mainnet' : 'testnet',
  [Chain.Polygon]: APP_CLUSTER === 'mainnet' ? 'matic' : 'mumbai',
  [Chain.Avalanche]: APP_CLUSTER === 'mainnet' ? 'avalanche' : '0xa869',
  [Chain.BSC]: APP_CLUSTER === 'mainnet' ? 'bsc' : '0x61',
}

export const PolygonChainConfig = {
  chainId: `0x${ChainPolygonID.toString(16)}`,
  chainName: APP_CLUSTER === 'mainnet' ? 'Matic mainnet' : 'Mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: APP_CLUSTER === 'mainnet' ? ['https://matic-mainnet.chainstacklabs.com'] : ['https://rpc-mumbai.maticvigil.com'],
  blockExplorerUrls: APP_CLUSTER === 'mainnet' ? ['https://polygonscan.com/'] : ['https://mumbai.polygonscan.com/'],
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

export const BscChainConfig = {
  chainId: `0x${ChainBscID.toString(16)}`,
  chainName: APP_CLUSTER === 'mainnet' ? 'BSC mainnet' : 'BSC testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: APP_CLUSTER === 'mainnet' ? ['https://rpc.ankr.com/bsc'] : ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  blockExplorerUrls: APP_CLUSTER === 'mainnet' ? ['https://bscscan.com/'] : ['https://testnet.bscscan.com/'],
}

export const BobaNetworkConfig = {
  chainId: `0x${ChainBscID.toString(16)}`,
  chainName: APP_CLUSTER === 'mainnet' ? 'Boba Network' : 'Boba Rinkeby',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: APP_CLUSTER === 'mainnet' ? ['https://mainnet.boba.network	'] : ['https://rinkeby.boba.network/	'],
  blockExplorerUrls: APP_CLUSTER === 'mainnet' ? ['https://blockexplorer.boba.network/'] : ['https://blockexplorer.rinkeby.boba.network/'],
}

export const ChainConfigs = {
  [Chain.Polygon]: PolygonChainConfig,
  [Chain.Avalanche]: AvalancheChainConfig,
  [Chain.BSC]: BscChainConfig,
  [Chain.Boba]: BobaNetworkConfig,
}
