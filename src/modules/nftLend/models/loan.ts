import moment from 'moment-timezone';
import { Chain } from 'src/common/constants/network';
import { getLinkEvmExplorer } from 'src/modules/evm/utils';
import { getLinkNearExplorer } from 'src/modules/near/utils';
import { getLinkSolScanExplorer } from 'src/modules/solana/utils';
import { isEvmChain, parseNftFromLoanAsset } from '../utils';
import { Currency, LoanData, LoanDataAsset } from './api';
import { AssetNft } from './nft';
import { OfferToLoan } from './offer';

export class LoanNft {
  id!: number;
  asset?: AssetNft;
  chain: Chain;
  currency?: Currency;
  principal_amount: number = 0;
  interest_rate: number = 0;
  duration: number = 0;
  seo_url?: string;
  owner: string = '';
  data_loan_address: string = '';
  data_asset_address: string = '';
  origin_contract_address: string = '';
  nonce: string = '';
  signature: string = '';
  status: string = '';
  created_at: string = '';
  updated_at: string = '';
  init_tx_hash: string = '';
  offers: Array<OfferToLoan> = [];
  approved_offer?: OfferToLoan;

  constructor(chain: Chain) {
    this.id = 0;
    this.chain = chain;
  }

  static parseFromApi(data: LoanData): LoanNft {
    if (!data) throw new Error('No loan data to parse');
    const network = data.network;
    const chain = network as Chain;
    let loan = new LoanNft(chain);
    loan.id = data.id;
    loan.currency = data.currency;
    loan.principal_amount = data.principal_amount;
    loan.interest_rate = data.interest_rate;
    loan.duration = data.duration;
    loan.seo_url = data.asset.seo_url;
    loan.owner = data.owner;
    loan.nonce = data.nonce_hex;
    loan.signature = data.signature;
    loan.status = data.status;
    loan.created_at = data.created_at;
    loan.updated_at = data.updated_at;
    loan.init_tx_hash = data.init_tx_hash;
    loan.data_loan_address = data.data_loan_address;
    loan.data_asset_address = data.data_asset_address;
    loan.offers = data.offers.map(e => OfferToLoan.parseFromApi(e, chain));
    loan.asset = parseNftFromLoanAsset(data.asset, chain)
    if (data.approved_offer) {
      loan.approved_offer = OfferToLoan.parseFromApi(data.approved_offer, chain);
      loan.approved_offer.started_at = data.offer_started_at;
      loan.approved_offer.expired_at = data.offer_expired_at;
    }
    return loan;
  }

  static parseFromApiDetail(data: LoanDataAsset): LoanNft {
    if (!data) throw new Error('No loan detail data to parse');
    if (!data) throw new Error('No loan detail data to parse');

    const network = data.new_loan?.network;
    const chain = network as Chain;
    let loan = new LoanNft(chain);
    loan.seo_url = data.seo_url;
    loan.asset = parseNftFromLoanAsset(data, chain);

    if (data.new_loan)  {
      loan.id = data.new_loan.id;
      loan.currency = data.new_loan.currency;
      loan.principal_amount = data.new_loan.principal_amount;
      loan.interest_rate = data.new_loan. interest_rate;
      loan.duration = data.new_loan.duration;
      loan.owner = data.new_loan.owner;
      loan.nonce = data.new_loan.nonce_hex;
      loan.signature = data.new_loan.signature;
      loan.status = data.new_loan.status;
      loan.created_at = data.new_loan.created_at;
      loan.updated_at = data.new_loan.updated_at;
      loan.init_tx_hash = data.new_loan.init_tx_hash;
      loan.data_loan_address = data.new_loan.data_loan_address;
      loan.data_asset_address = data.new_loan.data_asset_address;
      loan.offers = data.new_loan.offers.map(e => OfferToLoan.parseFromApi(e, chain));
      
      if (data.new_loan.approved_offer) {
        loan.approved_offer = OfferToLoan.parseFromApi(data.new_loan.approved_offer, chain);
        loan.approved_offer.started_at = data.new_loan.offer_started_at;
        loan.approved_offer.expired_at = data.new_loan.offer_expired_at;
      }
    }
    return loan;
  }

  getLinkExplorerAddr(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.init_tx_hash);
    if (this.chain === Chain.Near) return getLinkNearExplorer(address || this.init_tx_hash);
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || '', this.chain, 'address');
    throw new Error(`Chain ${this.chain} is not supported`);
  }

  getLinkExplorerTx(address?: string): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(address || this.init_tx_hash, );
    if (this.chain === Chain.Near) return getLinkNearExplorer(address || this.init_tx_hash, 'tx');
    if (isEvmChain(this.chain)) return getLinkEvmExplorer(address || this.init_tx_hash, this.chain, 'tx');
    throw new Error(`Chain ${this.chain} is not supported`);
  }

  isListing(): boolean {
    return this.status === 'new';
  }

  isOngoing(): boolean {
    return this.status === 'created';
  }

  isLiquidated(): boolean {
    return this.status === 'created' && moment().isAfter(moment(this.approved_offer?.expired_at));
  }
}
