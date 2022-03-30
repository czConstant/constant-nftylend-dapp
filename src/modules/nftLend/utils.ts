import moment from 'moment-timezone';
import BigNumber from 'bignumber.js';

import { Chain } from 'src/common/constants/network';
import { EvmNft } from '../evm/models/evmNft';
import { getLinkEvmExplorer } from '../evm/utils';
import { SolanaNft } from '../solana/models/solanaNft';
import { getLinkSolScanAccount } from '../solana/utils';
import { LoanDataAsset } from './models/api';

export function parseNftFromLoanAsset(asset: LoanDataAsset, chain: Chain) {
  if (!asset) throw new Error('Loan has no asset');
  if (chain === Chain.Solana)
    return SolanaNft.parseFromLoanAsset(asset);
  if (chain === Chain.Polygon)
    return EvmNft.parseFromLoanAsset(asset, chain);
  if (chain === Chain.Avalanche)
    return EvmNft.parseFromLoanAsset(asset, chain);
  throw new Error(`Chain ${chain} is not supported`);
}

export function getLinkExplorerWallet(address: string, chain: Chain): string {
  if (isEvmChain(chain)) return getLinkEvmExplorer(address, chain);
  if (chain === Chain.Solana) return getLinkSolScanAccount(address); 
  return '';
}

export function isEvmChain(chain: Chain) {
  return [Chain.Polygon, Chain.Avalanche].includes(chain);
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

export const calculateTotalPay = (principal: number, interest: number, duration: number /* seconds */, startedAt: number /* timestamp seconds */) => {
  const DAY_SECS = 86400;
  const payAt = moment().unix();

  const maxLoanDay = duration / DAY_SECS;
  let loanDay = maxLoanDay;
  if (payAt < startedAt + duration && payAt > startedAt) {
    loanDay = Math.floor((payAt - startedAt) / DAY_SECS) + 1;
  }
  if (loanDay >= maxLoanDay) {
    loanDay = maxLoanDay;
  }

  const primaryInterest = new BigNumber(principal)
    .multipliedBy(interest)
    .dividedToIntegerBy(10000)
    .multipliedBy(loanDay)
    .dividedToIntegerBy(365);
  let secondaryInterest = new BigNumber(0);
  if (maxLoanDay > loanDay) {
    // 50% interest remain day
    secondaryInterest = new BigNumber(principal)
      .multipliedBy(interest)
      .dividedToIntegerBy(10000)
      .multipliedBy(maxLoanDay - loanDay)
      .dividedToIntegerBy(365)
      .dividedToIntegerBy(2);
  }
  // 1% fee (base on principal amount)
  const matchingFee = new BigNumber(principal).dividedToIntegerBy(100);

  return new BigNumber(principal)
    .plus(primaryInterest)
    .plus(secondaryInterest)
    .plus(matchingFee)
    .toNumber();
};