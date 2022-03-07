import {
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
  CHAIN_ID_OASIS,
  isEVMChain,
  hexToUint8Array,
  hexToNativeString,
  uint8ArrayToHex,
  nativeToHexString,
  ChainId,
  WSOL_ADDRESS,
  WSOL_DECIMALS,
} from '@certusone/wormhole-sdk/lib/cjs/utils';

import {
  getForeignAssetEth,
  getForeignAssetSolana,
  getOriginalAssetEth,
  getOriginalAssetSol,
  WormholeWrappedInfo,
} from '@certusone/wormhole-sdk/lib/esm/token_bridge';

import {
  getOriginalAssetEth as getOriginalAssetEthNFT,
  getOriginalAssetSol as getOriginalAssetSolNFT,
  getForeignAssetEth as getForeignAssetEthNFT,
  getForeignAssetSolana as getForeignAssetSolNFT,
} from '@certusone/wormhole-sdk/lib/esm/token_bridge';

import {
  NFTImplementation,
  TokenImplementation,
  NFTImplementation__factory,
  TokenImplementation__factory,
} from '@certusone/wormhole-sdk/lib/cjs/ethers-contracts';

import {
  WormholeAbi__factory,
} from '@certusone/wormhole-sdk/lib/esm/ethers-contracts/abi';

export {
  CHAIN_ID_AVAX,
  CHAIN_ID_BSC,
  CHAIN_ID_ETH,
  CHAIN_ID_ETHEREUM_ROPSTEN,
  CHAIN_ID_POLYGON,
  CHAIN_ID_SOLANA,
  CHAIN_ID_TERRA,
  CHAIN_ID_OASIS,
  isEVMChain,
  WSOL_ADDRESS,
  WSOL_DECIMALS,
  type ChainId,

  hexToUint8Array,
  hexToNativeString,
  uint8ArrayToHex,
  nativeToHexString,

  type NFTImplementation,
  type TokenImplementation,
  NFTImplementation__factory,
  TokenImplementation__factory,
  WormholeAbi__factory,

  getForeignAssetEth,
  getForeignAssetSolana,
  getOriginalAssetEth,
  getOriginalAssetSol,
  type WormholeWrappedInfo,
  getOriginalAssetEthNFT,
  getOriginalAssetSolNFT,
  getForeignAssetEthNFT,
  getForeignAssetSolNFT,
};