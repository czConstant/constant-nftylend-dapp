import { ethers } from 'ethers';

import { customAlphabet } from 'nanoid';
import { APP_CLUSTER } from 'src/common/constants/config';
import { Chain, ChainAvalancheID, ChainPolygonID } from 'src/common/constants/network';
import store from 'src/store';
import IERC721 from './abi/IERC20.json';

export const generateNonce = (): string => {
  return  '0x' + customAlphabet('0123456789abcdef', 64)();
}

export const getLinkPolygonExplorer = (address?: string, type?: 'tx' | 'address') =>
  `https://${APP_CLUSTER === 'testnet' ? 'mumbai.' : ''}polygonscan.com/${type || 'address'}/${address}`;

export const getPolygonLendingProgramId = () => {
  return store.getState().nftyLend.configs.matic_nftypawn_address;
};

export const getEvmBalance = async (owner: string, contractAddress: string): Promise<any> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
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