import { ChainsById } from '../utils/constant';

export interface StateSafeWormholeWrappedInfo {
  isWrapped: boolean;
  chainId: ChainsById;
  assetAddress: string;
  tokenId?: string;
}