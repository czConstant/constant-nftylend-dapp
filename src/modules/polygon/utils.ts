import { customAlphabet } from 'nanoid';
import { APP_CLUSTER } from 'src/common/constants/config';

export const generateNonce = (): string => {
  return  '0x' + customAlphabet('0123456789abcdef', 64)();
}

export const getLinkPolygonExplorer = (address?: string, type?: 'tx' | 'address') =>
  `https://${APP_CLUSTER === 'testnet' ? 'mumbai.' : ''}polygonscan.com/${type || 'address'}/${address}`;