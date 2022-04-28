import { AssetNftAttribute } from './nft';

export class ResponseResult {
  error: any;
  result!: any;
}

export class ListResponse extends ResponseResult {
  count: number | undefined;
}

export interface Currency {
  admin_fee_address: string;
  balance: number;
  contract_address: string;
  created_at: string;
  decimals: number;
  icon_url: string;
  id: number;
  name: string;
  network: string;
  symbol: string;
  updated_at: string;
}

export interface SubmitCollection {
  network: string;
  name: string;
  description: string;
  creator: string;
  contract_address: string;
  contact_info: string;
}

export interface CollectionData {
  id: number;
  name: string;
  seo_url: string;
  description: string;
  total_listed: number;
  listing_total: number;
  avg24h_amount: string;
  total_volume: string;
  listing_asset?: LoanDataAsset;
  rand_asset?: LoanDataAsset;
  network: string;
}

export interface LoanData {
  id: number;
  asset: LoanDataAsset;
  currency: Currency;
  principal_amount: number;
  interest_rate: number;
  duration: number;
  data_asset_address: string;
  data_loan_address: string;
  network: string;
  owner: string;
  nonce_hex: string;
  signature: string;
  status: string;
  created_at: string;
  updated_at: string;
  init_tx_hash: string;
  offers: Array<OfferData>;
  approved_offer: OfferData;
  offer_started_at: string;
  offer_expired_at: string;
}

export interface LoanDataAsset {
  id: number;
  name: string;
  network: string;
  token_id: string;
  contract_address: string;
  collection?: CollectionData;
  token_url: string;
  seo_url: string;
  attributes: AssetNftAttribute;
  new_loan?: LoanData;
  seller_fee_rate: number;
  origin_contract_network: string;
  origin_contract_address: string;
}

export interface OfferData {
  id: number;
  lender: string;
  status: string;
  principal_amount: number;
  interest_rate: number;
  duration: number;
  loan: LoanData;
  loan_id: number;
  data_offer_address: string;
  data_currency_address: string;
  created_at: string;
  updated_at: string;
  accept_tx_hash: string;
  close_tx_hash: string;
  nonce_hex: string;
  signature: string;
}