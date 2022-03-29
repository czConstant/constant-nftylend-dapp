import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import { getNftsByOwner } from '../evm/api';
import { PolygonNft } from '../evm/models/evmNft';
import { getLinkPolygonExplorer } from '../evm/utils';
import { SolanaNft } from '../solana/models/solanaNft';
import { getLinkSolScanAccount } from '../solana/utils';
import { LoanDataAsset } from './models/api';
import { AssetNft } from './models/nft';

export async function fetchNftsByOwner(address: string, chain: Chain, solConnection?: Connection): Promise<Array<AssetNft>> {
  let assets = [];
  if (chain === Chain.Solana) {
    const res = await getParsedNftAccountsByOwner({ publicAddress: address, connection: solConnection });
    assets = res.map(e => {
      const nft = SolanaNft.parse(e);
      return nft;
    });
  } else {
    const res = await getNftsByOwner(address, chain);
    assets = res.result.map((e: any) => {
      const nft = PolygonNft.parse(e);
      nft.owner = address;
      return nft;
    });
  }
  return assets;
}

export function parseNftFromLoanAsset(asset: LoanDataAsset, chain: Chain) {
  if (!asset) throw new Error('Loan has no asset');
  if (chain === Chain.Solana)
    return SolanaNft.parseFromLoanAsset(asset);
  if (chain === Chain.Polygon)
    return PolygonNft.parseFromLoanAsset(asset);
  if (chain === Chain.Avalanche)
    return PolygonNft.parseFromLoanAsset(asset);
  throw new Error(`Chain ${chain} is not supported`);
}

export function getLinkExplorerWallet(address: string, chain: Chain) {
  switch (chain) {
    case Chain.Solana:
      return getLinkSolScanAccount(address);
    case Chain.Polygon:
      return getLinkPolygonExplorer(address);
  }
}

export function isEvmChain(chain: Chain) {
  return [Chain.Polygon, Chain.Avalanche].includes(chain);
}