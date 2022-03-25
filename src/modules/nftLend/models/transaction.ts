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