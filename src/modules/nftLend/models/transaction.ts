import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { EvmProvider } from 'src/common/constants/wallet';

export interface TransactionResult {
  txHash: string;
  txExplorerUrl: string;
  blockNumber: number;
  completed: boolean;
}

export interface TransactionOptions {
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
  evm?: {
    provider?: EvmProvider;
  }
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
  loan_config: number;
  available_in: number;
}

export interface CancelLoanParams {
  asset_token_id: string;
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
  available_in: number;
}

export interface CancelOfferParams {
  asset_contract_address: string;
  asset_token_id: string;
  currency_contract_address: string;
  currency_data_address: string;
  offer_data_address: string;
  offer_id: number;
  nonce: string;
}

export interface AcceptOfferParams {
  asset_token_id: string;
  asset_contract_address: string;
  currency_contract_address: string;
  loan_data_address: string;
  offer_data_address: string;
  offer_id: number;
  currency_data_address: string;
  currency_decimals: number;
  principal: number;
  rate: number;
  duration: number;
  borrower: string;
  borrower_nonce: string;
  borrower_signature: string;
  lender: string;
  lender_nonce: string;
  lender_signature: string;
}

export interface OrderNowParams {
  asset_token_id: string;
  asset_contract_address: string;
  loan_data_address: string;
  currency_contract_address: string;
  currency_decimals: number;
  principal: number;
  rate: number;
  duration: number;
  borrower: string;
  borrower_nonce: string;
  borrower_signature: string;
}

export interface LiquidateLoanParams {
  loan_owner: string;
  asset_token_id: string;
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
  principal: number;
  rate: number;
  duration: number;
  currency_decimal: number;
  loan_data_address: string;
  offer_data_address: string;
  asset_data_address: string,
  asset_contract_address: string;
  asset_token_id: string;
  currency_data_address: string;
  currency_contract_address: string;
  lender: string;
  admin_fee_address: string;
}
