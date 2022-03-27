import { Chain } from 'src/common/constants/network';
import { PolygonNft } from '../polygon/models/polygonNft';
import { SolanaNft } from '../solana/models/solanaNft';
import { LoanDataAsset } from './models/api';

export function parseNftFromLoanAsset(asset: LoanDataAsset, chain: Chain) {
  if (!asset) throw new Error('Loan has no asset');
  if (chain === Chain.Solana)
    return SolanaNft.parseFromLoanAsset(asset);
  if (chain === Chain.Polygon)
    return PolygonNft.parseFromLoanAsset(asset);
  throw new Error(`Chain ${chain} is not supported`);
}