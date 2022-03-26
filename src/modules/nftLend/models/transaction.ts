import { NftID } from './nft';

export interface TransactionResult {
  txHash: string;
  txExplorerUrl: string;
}

export interface CreateLoanParams {
  asset_token_id: NftID;
  asset_contract_address: string;
  currency_contract_address: string;
  currency_decimal: number,
  currency_id: number,
  principal: number;
  rate: number;
  duration: number;
}

export interface CancelLoanParams {
  asset_contract_address: string;
  loan_data_address: string;
  nonce: string;
}

export interface MakeOfferParams {
  currency_contract_address: NftID;
  currency_decimal: number,
  loan_owner: string;
  data_loan_address: string;
  principal: number;
  rate: number;
  duration: number;
}

export interface CancelOfferParams {
  currency_contract_address: string;
  currency_data_address: string;
  offer_data_address: string;
  nonce: string;
}
