import { Chain } from 'src/common/constants/network';
import { getLinkEvmExplorer } from 'src/modules/evm/utils';
import { getLinkSolScanExplorer } from 'src/modules/solana/utils';
import { isEvmChain } from '../utils';
import { TransactionData } from './api';
import { LoanNft } from './loan';

export enum ActivityType {
  sale = 'sale',
  loan = 'loan',
  none = '',
}

export enum ActivityStatus {
  listed = 'listed',
  none = '',
}

export class AssetActivity {
  id: number = 0;
  created_at: string = '';
  expired_at: string = '';
  lender: string = '';
  borrower: string = '';
  loan?: LoanNft;
  chain: Chain = Chain.None;
  principal: number = 0;
  interest: number = 0;
  duration: number = 0;
  type: ActivityType  = ActivityType.none;
  status: ActivityStatus  = ActivityStatus.none;
  tx_hash: string = '';

  static parseFromApi(data: TransactionData, type?: ActivityType): AssetActivity {
    let activity = new AssetActivity();
    activity.id = data.id;
    activity.created_at = data.created_at;
    activity.expired_at = data.expired_at;
    activity.lender = data.lender.toLowerCase();
    activity.borrower = data.borrower.toLowerCase();
    activity.chain = data.network as Chain;
    activity.principal = data.principal_amount;
    activity.interest = data.interest_rate;
    activity.duration = data.duration;
    activity.status = data.type as ActivityStatus;
    activity.type = type || ActivityType.none;
    activity.tx_hash = data.tx_hash;
    activity.loan = LoanNft.parseFromApi(data.loan);

    return activity;
  }

  getLinkExplorerAddr(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.tx_hash);
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || '', this.chain, 'address');
    throw new Error(`Chain ${this.chain} is not supported`);
  }

  getLinkExplorerTx(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.tx_hash);
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || this.tx_hash, this.chain, 'tx');
    throw new Error(`Chain ${this.chain} is not supported`);
  }
}
