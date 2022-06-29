import moment from 'moment-timezone';
import BigNumber from 'bignumber.js';

import { Chain } from 'src/common/constants/network';
import { EvmNft } from '../evm/models/evmNft';
import { checkOwnerNft, getLinkEvmExplorer } from '../evm/utils';
import { SolanaNft } from '../solana/models/solanaNft';
import { getLinkSolScanExplorer } from '../solana/utils';
import { Currency, LoanDataAsset } from './models/api';
import { NearNft } from '../near/models/nearNft';

interface ImageThumb {
  width?: number;
  height?: number;
  url: string;
  showOriginal?: boolean;
}

export const getImageThumb = (params: ImageThumb) => {
  const { width, height, url, showOriginal } = params;
  if (!url) return '';
  if (showOriginal)
    return `https://nftpawn.financial/cdn-cgi/image/quality=100/${encodeURIComponent(
      url
    )}`;
  return `https://nftpawn.financial/cdn-cgi/image/width=${width},height=${height},quality=100,fit=crop/${encodeURIComponent(
    url
  )}`;
};

export const convertIpfsToHttp = (uri: string, base?: string): string => {
  if (!uri) return '';
  if (isUrl(uri)) {
    return String(uri)
    .replace('https://ipfs.io/ipfs/', 'https://cloudflare-ipfs.com/ipfs/')
    .replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
  } else {
    const url = `${base || 'https://cloudflare-ipfs.com/ipfs'}/${uri}`;
    return fixUrlMultiSlash(url);
  }
}

const fixUrlMultiSlash = (str: string): string => {
  return str.replace(/([^:])(\/{2,})/g,'$1/')
}

const isUrl = (url: string): boolean => {
  try { return Boolean(new URL(url)); }
  catch(e){ return false; }
}

export const isNativeToken = (contractAddress: string, chain: Chain | string): boolean => {
  return contractAddress === chain.toLowerCase()
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

export function getAvailableAt(availableInSec: number): number {
  return new BigNumber(new Date().getTime()).dividedToIntegerBy(1000).plus(availableInSec).toNumber();
};

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

export const calculateTotalPay = (principal: number, interest: number, duration: number /* seconds */, decimals: number, startedAt: number /* timestamp seconds */) => {
  const DAY_SECS = 86400;
  const payAt = moment().unix();

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
    .shiftedBy(decimals)
    .multipliedBy(interest)
    .multipliedBy(loanDay)
    .dividedToIntegerBy(365);
  let secondaryInterest = new BigNumber(0);
  if (maxLoanDay > loanDay) {
    // 50% interest remain day
    secondaryInterest = new BigNumber(principal)
      .shiftedBy(decimals)
      .multipliedBy(interest)
      .multipliedBy(maxLoanDay - loanDay)
      .dividedToIntegerBy(365)
      .dividedToIntegerBy(2);
  }
  // 1% fee (base on principal amount)
  const matchingFee = new BigNumber(principal)
    .shiftedBy(decimals)
    .dividedToIntegerBy(100);

  return new BigNumber(principal)
    .shiftedBy(decimals)
    .plus(primaryInterest)
    .plus(secondaryInterest)
    .plus(matchingFee)
    .shiftedBy(-decimals)
    .toString();
};