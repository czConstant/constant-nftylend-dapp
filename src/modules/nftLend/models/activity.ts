import { Chain } from 'src/common/constants/network';
import { getLinkEvmExplorer } from 'src/modules/evm/utils';
import { getLinkNearExplorer } from 'src/modules/near/utils';
import { getLinkSolScanExplorer } from 'src/modules/solana/utils';
import { isEvmChain, parseNftFromLoanAsset } from '../utils';
import { Currency } from './api';
import { LoanNft } from './loan';
import { AssetNft } from './nft';

export enum ActivityType {
  sale = 'sale',
  loan = 'loan',
  none = '',
}

export enum ActivityStatus {
  listed = 'listed',
  none = '',
}

export abstract class AssetActivity {
  id: number = 0;
  created_at: string = '';
  chain: Chain = Chain.None;
  type: ActivityType  = ActivityType.none;
  tx_hash: string = ''

  getLinkExplorerAddr(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.tx_hash, 'tx');
    if (this.chain === Chain.Near) return getLinkNearExplorer(address || this.tx_hash, 'tx');
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || '', this.chain, 'address');
    throw new Error(`Chain ${this.chain} is not supported`);
  }

  getLinkExplorerTx(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.tx_hash, 'tx');
    if (this.chain === Chain.Near) return getLinkNearExplorer(address || this.tx_hash, 'tx');
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || this.tx_hash, this.chain, 'tx');
    throw new Error(`Chain ${this.chain} is not supported`);
  }
}

export class AssetLoanHistory extends AssetActivity {
  lender: string = '';
  borrower: string = '';
  loan?: LoanNft;
  principal: number = 0;
  interest: number = 0;
  duration: number = 0;
  expired_at: string = '';
  status: ActivityStatus  = ActivityStatus.none;

  static parseFromApi(data: any): AssetActivity {
    let activity = new AssetLoanHistory();
    activity.id = data.id;
    activity.created_at = data.created_at;
    activity.chain = data.network as Chain;

    activity.expired_at = data.expired_at;
    activity.lender = data.lender.toLowerCase();
    activity.borrower = data.borrower.toLowerCase();
    activity.chain = data.network as Chain;
    activity.principal = data.principal_amount;
    activity.interest = data.interest_rate;
    activity.duration = data.duration;
    activity.status = data.type as ActivityStatus;
    activity.type = ActivityType.loan;
    activity.tx_hash = data.tx_hash;
    activity.loan = LoanNft.parseFromApi(data.loan);

    return activity;
  }
}

export class AssetSaleHistory extends AssetActivity {
  amount: number = 0;
  asset?: AssetNft;
  buyer: string = '';
  seller: string = '';
  source: string = '';
  transaction_at: string = '';
  currency?: Currency;

  static parseFromApi(data: any): AssetActivity {
    let activity = new AssetSaleHistory();
    activity.id = data.id;
    activity.created_at = data.created_at;
    activity.chain = data.network as Chain;

    activity.type = ActivityType.sale;
    activity.tx_hash = data.transaction_id;
    activity.transaction_at = data.transaction_at;
    activity.buyer = data.buyer;
    activity.seller = data.seller;
    activity.source = data.source;
    activity.asset = parseNftFromLoanAsset(data.asset, activity.chain);

    return activity;
  }
}