import { Chain } from 'src/common/constants/network';
import { PolygonNft } from 'src/modules/polygon/models/polygonNft';
import { getLinkPolygonExplorer } from 'src/modules/polygon/utils';
import { SolanaNft } from 'src/modules/solana/models/solanaNft';
import { getLinkSolScanExplorer } from 'src/modules/solana/utils';
import { Currency, LoanData, LoanDataAsset, OfferData } from './api';
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
  offers: Array<OfferToLoan> = [];
  owner: string = '';
  data_loan_address: string = '';
  origin_contract_address: string = '';
  nonce: string = '';
  status: string = '';
  created_at: string = '';
  init_tx_hash: string = '';

  constructor(chain: Chain) {
    this.id = 0;
    this.chain = chain;
  }

  static parseFromApi(data: LoanData): LoanNft {
    if (!data) throw new Error('No loan data to parse');
    const network = data.network;
    const chain = network === 'SOL' ? Chain.Solana : Chain.Polygon; 
    let loan = new LoanNft(chain);
    loan.id = data.id;
    loan.currency = data.currency;
    loan.principal_amount = data.principal_amount;
    loan.interest_rate = data.interest_rate;
    loan.duration = data.duration;
    loan.seo_url = data.asset.seo_url;
    loan.owner = data.owner;
    loan.nonce = data.nonce_hex;
    loan.status = data.status;
    loan.created_at = data.created_at;
    loan.init_tx_hash = data.init_tx_hash;
    loan.data_loan_address = data.data_loan_address;
    loan.offers = data.offers.map(e => OfferToLoan.parseFromApi(e, chain));
    if (loan.chain === Chain.Solana) {
      loan.asset = SolanaNft.parseFromLoanAsset(data.asset);
    } else if (loan.chain === Chain.Polygon) {
      loan.asset = PolygonNft.parseFromLoanAsset(data.asset);
    }

    return loan;
  }

  static parseFromApiDetail(data: LoanDataAsset): LoanNft {
    if (!data) throw new Error('No loan detail data to parse');
    if (!data) throw new Error('No loan detail data to parse');

    const network = data.new_loan?.network;
    const chain = network === 'SOL' ? Chain.Solana : Chain.Polygon;
    let loan = new LoanNft(chain);
    loan.id = data.id;
    loan.seo_url = data.seo_url;

    if (data.new_loan)  {
      loan.currency = data.new_loan.currency;
      loan.principal_amount = data.new_loan.principal_amount;
      loan.interest_rate = data.new_loan. interest_rate;
      loan.duration = data.new_loan.duration;
      loan.owner = data.new_loan.owner;
      loan.nonce = data.new_loan.nonce_hex;
      loan.status = data.new_loan.status;
      loan.created_at = data.new_loan.created_at;
      loan.init_tx_hash = data.new_loan.init_tx_hash;
      loan.data_loan_address = data.new_loan.data_loan_address;
      loan.offers = data.new_loan.offers.map(e => OfferToLoan.parseFromApi(e, chain));
    }
    if (loan.chain === Chain.Solana) {
      loan.asset = SolanaNft.parseFromLoanAsset(data);
    } else if (loan.chain === Chain.Polygon) {
      loan.asset = PolygonNft.parseFromLoanAsset(data);
    }
    return loan;
  }

  getLinkExplorer(): string {
    if (this.chain === Chain.Solana) return getLinkSolScanExplorer(this.init_tx_hash);
    else return getLinkPolygonExplorer(this.init_tx_hash);
  }
}
