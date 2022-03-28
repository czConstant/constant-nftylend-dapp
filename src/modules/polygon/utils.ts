import { customAlphabet } from 'nanoid';
import { APP_CLUSTER } from 'src/common/constants/config';
import store from 'src/store';

export const generateNonce = (): string => {
  return  '0x' + customAlphabet('0123456789abcdef', 64)();
}

export const getLinkPolygonExplorer = (address?: string, type?: 'tx' | 'address') =>
  `https://${APP_CLUSTER === 'testnet' ? 'mumbai.' : ''}polygonscan.com/${type || 'address'}/${address}`;

export const getPolygonLendingProgramId = () => {
  return store.getState().nftyLend.configs.program_id;
};