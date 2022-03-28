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
  asset_contract_address: string;
  asset_token_id: string,
  loan_owner: string;
  lender: string;
  loan_data_address: string;
  principal: number;
  rate: number;
  duration: number;
}

export interface OrderOfferParams {
  currency_contract_address: NftID;
  currency_decimal: number;
  loan_owner: string;
  loan_data_address: string;
  lender: string;
  principal: number;
}

export interface CancelOfferParams {
  currency_contract_address: string;
  currency_data_address: string;
  offer_data_address: string;
  nonce: string;
}

export interface AcceptOfferParams {
  currency_contract_address: string;
  loan_data_address: string;
  offer_data_address: string;
  currency_data_address: string;
  currency_decimals: number;
  offer_owner: string;
  principal: number;
  rate: number;
  duration: number;
}

export interface LiquidateLoanParams {
  loan_owner: string;
  asset_contract_address: string;
  asset_data_address: string;
  loan_data_address: string;
  offer_data_address: string;
  currency_data_address: string;
}

export interface CloseOfferParams {
  offer_data_address: string;
  currency_data_address: string;
  currency_contract_address: string;
}

export interface PayLoanParams {
  pay_amount: number;
  currency_decimal: number;
  loan_data_address: string;
  offer_data_address: string;
  asset_data_address: string,
  asset_contract_address: string;
  currency_data_address: string;
  currency_contract_address: string;
  lender: string;
  admin_fee_address: string;
}
