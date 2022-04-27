import moment from 'moment-timezone';
import BigNumber from 'bignumber.js';

import { Chain } from 'src/common/constants/network';
import { EvmNft } from '../evm/models/evmNft';
import { checkOwnerNft, getLinkEvmExplorer } from '../evm/utils';
import { SolanaNft } from '../solana/models/solanaNft';
import { getLinkSolScanExplorer } from '../solana/utils';
import { LoanDataAsset } from './models/api';
import { NearNft } from '../near/models/nearNft';
import { AssetNft } from './models/nft';

interface ImageThumb {
  width: number;
  height: number;
  url: string;
  showOriginal?: boolean;
}

export const generateSeoUrl = (asset: AssetNft): string => {
  const id = asset.chain === Chain.Solana
    ? asset.contract_address
    : `${asset.contract_address}-${asset.token_id}`;
  return id.replaceAll(/[^a-zA-Z0-9]+/g, '-');
}

export const getImageThumb = (params: ImageThumb, chain?: Chain) => {
  const { width, height, url, showOriginal } = params;
  if (chain === Chain.Solana) {
    if (showOriginal)
      return `https://solana-cdn.com/cdn-cgi/image/quality=100/${encodeURIComponent(
        url
      )}`;
    return `https://solana-cdn.com/cdn-cgi/image/width=${width},height=${height},quality=100,fit=crop/${encodeURIComponent(
      url
    )}`;
  }
  return getUrlWithIpfsDefault(url);
};

export const getUrlWithIpfsDefault = (url: string): string => {
  if (!url) return '';
  if (url.includes('https://')) {
    return String(url).replace ('ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    return `https://cloudflare-ipfs.com/ipfs/${url}`;
  }
}

export function parseNftFromLoanAsset(asset: LoanDataAsset, chain: Chain) {
  if (!asset) throw new Error('Loan has no asset');
  if (chain === Chain.Solana)
    return SolanaNft.parseFromLoanAsset(asset);
  if (chain === Chain.Near)
    return NearNft.parseFromLoanAsset(asset);
  if (isEvmChain(chain))
    return EvmNft.parseFromLoanAsset(asset, chain);
  throw new Error(`Chain ${chain} is not supported`);
}

export function getLinkExplorerWallet(address: string, chain: Chain): string {
  if (isEvmChain(chain)) return getLinkEvmExplorer(address, chain);
  if (chain === Chain.Solana) return getLinkSolScanExplorer(address); 
  return '';
}

export function isEvmChain(chain: Chain) {
  return [Chain.Polygon, Chain.Avalanche, Chain.BSC, Chain.Boba].includes(chain);
}

export async function isAssetOwner(owner: string, chain: Chain, contractAddress: string, tokenId: string | number): Promise<boolean> {
  if (isEvmChain(chain)) return checkOwnerNft(owner, contractAddress, Number(tokenId));
  return true;
}

export const calculateMaxInterest = (principal: number, interest: number, duration: number): number => {
  const DAY_SECS = 86400;
  const loanDay = duration / DAY_SECS;
  
  const primaryInterest = new BigNumber(principal)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedBy(365);
  return primaryInterest.toNumber();
}

export const calculateMaxTotalPay = (principal: number, interest: number, duration: number): number => {
  const DAY_SECS = 86400;
  const loanDay = duration / DAY_SECS;
  const primaryInterest = new BigNumber(principal)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedBy(365);
  const matchingFee = new BigNumber(principal).dividedBy(100);
  return new BigNumber(principal)
    .plus(primaryInterest)
    .plus(matchingFee)
    .toNumber();
}

export const calculateTotalPay = (principal: number, decimals: number, interest: number, duration: number /* seconds */, startedAt: number /* timestamp seconds */) => {
  const DAY_SECS = 86400;
  const payAt = moment().unix();
  const _decimal = new BigNumber(10).pow(decimals)

  let maxLoanDay = Math.floor(duration / DAY_SECS);
  if (maxLoanDay === 0) maxLoanDay = 1;

  let loanDay = maxLoanDay;
  if (payAt < startedAt + duration && payAt > startedAt) {
    loanDay = Math.floor((payAt - startedAt) / DAY_SECS) + 1;
  }
  if (loanDay >= maxLoanDay) {
    loanDay = maxLoanDay;
  }

  const primaryInterest = new BigNumber(principal)
    .multipliedBy(_decimal)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedToIntegerBy(365);
  let secondaryInterest = new BigNumber(0);
  if (maxLoanDay > loanDay) {
    // 50% interest remain day
    secondaryInterest = new BigNumber(principal)
      .multipliedBy(_decimal)
      .multipliedBy(interest)
      .multipliedBy(maxLoanDay - loanDay)
      .dividedToIntegerBy(365)
      .dividedToIntegerBy(2);
  }
  // 1% fee (base on principal amount)
  const matchingFee = new BigNumber(principal)
    .multipliedBy(_decimal)
    .dividedToIntegerBy(100);

  return new BigNumber(principal)
    .multipliedBy(_decimal)
    .plus(primaryInterest)
    .plus(secondaryInterest)
    .plus(matchingFee)
    .dividedBy(_decimal)
    .toString(10);
};