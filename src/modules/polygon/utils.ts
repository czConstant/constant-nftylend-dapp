import { APP_CLUSTER } from 'src/common/constants/config';

export const getLinkPolygonExplorer = (address?: string) =>
  `https://${APP_CLUSTER === 'testnet' ? 'mumbai.' : ''}polygonscan.com/address/${address}`;