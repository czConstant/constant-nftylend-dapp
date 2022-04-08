import { ethers } from 'ethers';
import web3 from 'web3';

import { customAlphabet } from 'nanoid';
import { Chain, ChainAvalancheID, ChainConfigs, ChainPolygonID } from 'src/common/constants/network';
import store from 'src/store';
import IERC721 from './abi/IERC20.json';
import { getEvmProvider } from 'src/common/constants/wallet';

export const generateNonce = (): string => {
  let hex = customAlphabet('0123456789abcdef', 64)();
  if (hex.length % 2 === 1) hex = '0' + hex;
  return  '0x' + hex;
}

export const getMaxAllowance = (): string => {
  return web3.utils.toWei('1000000', 'ether');
}

export const getLinkEvmExplorer = (address: string, chain: Chain, type?: 'tx' | 'address') => {
  return `${ChainConfigs[chain].blockExplorerUrls[0]}${type || 'address'}/${address}`;
}

export const getPolygonLendingProgramId = () => {
  return store.getState().nftyLend.configs.matic_nftypawn_address;
};

export const getAvalancheLendingProgramId = () => {
  return store.getState().nftyLend.configs.avax_nftypawn_address;
};

export const getEvmBalance = async (owner: string, contractAddress: string): Promise<any> => {
  const provider = getEvmProvider();
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(contractAddress, IERC721.abi, signer);
  return contract.balanceOf(owner);
}

export const getChainIdByChain = (chain: Chain) => {
  switch (chain) {
    case Chain.Polygon:
      return ChainPolygonID;
    case Chain.Avalanche:
      return ChainAvalancheID;
    default:
      throw new Error(`Chain ${chain} is not supported`);
  }
}