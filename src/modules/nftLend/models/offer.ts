import { Chain } from 'src/common/constants/network';
import { getLinkPolygonExplorer } from 'src/modules/polygon/utils';
import { getLinkSolScanExplorer } from 'src/modules/solana/utils';
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
  accept_tx_hash: string = '';
  chain: Chain;
  nonce: string = '';

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
    offer.status = data.status;
    offer.created_at = data.created_at;
    offer.loan_id = data.loan_id;
    if (data.loan) offer.loan = LoanNft.parseFromApi(data.loan);
    offer.nonce = data.nonce;

    return offer;
  }

  getLinkExplorer(): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(this.accept_tx_hash);
    else return getLinkPolygonExplorer(this.accept_tx_hash);
  }
}
