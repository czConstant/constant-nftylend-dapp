import { ethers } from 'ethers';
import web3 from 'web3';

import { customAlphabet } from 'nanoid';
import { Chain, ChainConfigs } from 'src/common/constants/network';
import store from 'src/store';
import IERC20 from './abi/IERC20.json';
import IERC721 from './abi/IERC721.json';
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

export const getLendingProgramId = (chain: Chain) => {
  switch (chain) {
    case Chain.Polygon: 
      return store.getState().nftyLend.configs.matic_nftypawn_address;
    case Chain.Avalanche:
      return store.getState().nftyLend.configs.avax_nftypawn_address;
    case Chain.BSC:
      return store.getState().nftyLend.configs.bsc_nftypawn_address;
    case Chain.Boba:
      return store.getState().nftyLend.configs.boba_nftypawn_address;
  }
  throw new Error(`Chain ${chain} is not supported`);
};

export const getEvmBalance = async (owner: string, contractAddress: string): Promise<any> => {
  const provider = getEvmProvider();
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(contractAddress, IERC20.abi, signer);
  return contract.balanceOf(owner);
}

export const checkOwnerNft = async (owner: string, contractAddress: string, tokenId: number): Promise<boolean> => {
  const provider = getEvmProvider();
  const signer = provider.getSigner(0);
  const contract = new ethers.Contract(contractAddress, IERC721.abi, signer);
  const realOwner = await contract.ownerOf(tokenId);
  return owner === realOwner;
} 