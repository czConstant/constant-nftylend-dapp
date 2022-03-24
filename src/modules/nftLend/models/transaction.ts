export interface TransactionResult {
  txHash: string;
}

export interface CreateLoanParams {
  asset_contract_address: string;
  principal: number;
  rate: number;
  duration: number;
  options?: any;
}