import moment from 'moment-timezone';
import { Chain } from 'src/common/constants/network';
import { getLinkEvmExplorer } from 'src/modules/evm/utils';
import { getLinkSolScanExplorer } from 'src/modules/solana/utils';
import { OFFER_STATUS } from '../constant';
import { isEvmChain } from '../utils';
import { OfferData } from './api';
import { LoanNft } from './loan';

export class OfferToLoan {
  id: number = 0;
  lender: string = '';
  status: string = '';
  principal_amount: number = 0;
  interest_rate: number = 0;
  duration: number = 0;
  loan?: LoanNft;
  loan_id: number = 0;
  data_offer_address: string = '';
  data_currency_address: string = '';
  created_at: string = '';
  updated_at: string = '';
  accept_tx_hash: string = '';
  close_tx_hash: string = '';
  chain: Chain;
  nonce: string = '';
  signature: string = '';
  expired_at: string = '';
  started_at: string = '';

  constructor(chain: Chain) {
    this.chain = chain;
  }

  static parseFromApi(data: OfferData, chain: Chain): OfferToLoan {
    let offer = new OfferToLoan(chain);
    offer.id = data.id;
    offer.lender = data.lender;
    offer.principal_amount = data.principal_amount;
    offer.interest_rate = data.interest_rate;
    offer.duration = data.duration;
    offer.data_offer_address = data.data_offer_address;
    offer.data_currency_address = data.data_currency_address;
    offer.accept_tx_hash = data.accept_tx_hash;
    offer.close_tx_hash = data.close_tx_hash;
    offer.status = data.status;
    offer.created_at = data.created_at;
    offer.updated_at = data.updated_at;
    offer.loan_id = data.loan_id;
    if (data.loan) {
      offer.loan = LoanNft.parseFromApi(data.loan);
      offer.expired_at = data.loan.offer_expired_at;
      offer.started_at = data.loan.offer_started_at;
    }
    offer.nonce = data.nonce_hex;
    offer.signature = data.signature;

    return offer;
  }

  isApproved(): boolean {
    return this.status === OFFER_STATUS.approved.id;
  }

  getLinkExplorer(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.accept_tx_hash);
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || this.accept_tx_hash, this.chain);
    throw new Error(`Chain ${this.chain} is not supported`);
  }

  isLiquidated(): boolean {
    return this.status === 'approved' && moment().isAfter(moment(this.expired_at));
  }
}
