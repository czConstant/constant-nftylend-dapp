import { AssetNftAttribute } from './nft';

export interface ResponseResult {
  error?: any;
  result: any;
}

export interface ListResponse extends ResponseResult {
  count: number;
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
  price: number;
  claim_enabled: boolean;
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
  cover_url: string;
  description: string;
  total_listed: number;
  listing_total: number;
  avg24h_amount: number;
  total_volume: number;
  volume_usd: number;
  floor_price: number;
  new_loan?: LoanData;
  network: string;
  verified: boolean;
  creator_url: string;
  discord_url: string;
  twitter_id: string;
  currency: Currency;
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
  valid_at: string;
  config: number;
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
  mime_type: string;
  attributes: AssetNftAttribute;
  new_loan?: LoanData;
  seller_fee_rate: number;
  description: string;
  origin_contract_network: string;
  origin_contract_address: string;
  origin_token_id: string;
  stats: AssetStatData;
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
  valid_at: string;
  accept_tx_hash: string;
  close_tx_hash: string;
  nonce_hex: string;
  signature: string;
}

export interface AssetStatData {
  id: number;
  avg_price: number;
  currency: Currency;
  floor_price: number;
}

export interface UserData {
  id: number;
  address: string;
  created_at: string;
  email: string;
  network: string;
  news_noti_enabled: boolean;
  loan_noti_enabled: boolean;
  seen_noti_id: number;
}

export interface PwpBalanceData {
  balance: string;
  claimed_balance: string;
  locked_balance: string;
  created_at: string;
  updated_at: string;
  currency: Currency;
  network: string;
  user: UserData;
}