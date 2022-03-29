export interface TransactionResult {
  txHash: string;
  txExplorerUrl: string;
  blockNumber: number;
}

export interface CreateLoanParams {
  asset_token_id: string;
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
  currency_contract_address: string;
  currency_decimal: number,
  asset_contract_address: string;
  asset_token_id: string,
  loan_owner: string;
  lender: string;
  loan_data_address: string;
  loan_id: number;
  principal: number;
  rate: number;
  duration: number;
}

export interface OrderOfferParams {
  currency_contract_address: string;
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
  asset_token_id: string;
  asset_contract_address: string;
  currency_contract_address: string;
  loan_data_address: string;
  offer_data_address: string;
  currency_data_address: string;
  currency_decimals: number;
  borrower: string;
  offer_owner: string;
  principal: number;
  rate: number;
  duration: number;
  borrower_nonce: string;
  lender_nonce: string;
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
