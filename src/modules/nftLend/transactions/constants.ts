import { struct, u8 } from '@solana/buffer-layout';
import { publicKey, u64 } from '@solana/buffer-layout-utils';
import { APP_ENV } from 'src/common/constants/url';

export const LENDING_PROGRAM_ID = APP_ENV.REACT_SOL_DELEND_PROGRAM;
console.log("🚀 ~ file: constants.js ~ line 5 ~ LENDING_PROGRAM_ID", LENDING_PROGRAM_ID)

export const LOAN_INFO_LAYOUT = struct([
  u8('isInitialized'),
  publicKey('borrowerPubkey'),
  publicKey('collateralAccountPubkey'),
  publicKey('borrowerDenominationAccountPubkey'),
  u64('loanPrincipalAmount'),
  u64('loanDuration'),
  u64('interestRate'),
  publicKey('nftCollateralContract'),
  publicKey('loanDenomination'),
  u8('status'),
  u64('loanStartAt'),
  u64('payAmount'),
  publicKey('lenderPubkey'),
  publicKey('offerInfo'),
]);

export const INIT_LOAN_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  u64('loan_principal_amount'),
  u64('loan_duration'),
  u64('interest_rate'),
  publicKey('nft_collateral_contract'),
  publicKey('loan_denomination'),
]);

export const OFFER_INFO_LAYOUT = struct([
  u8('isInitialized'),
  publicKey('lenderPubkey'),
  publicKey('loanPubkey'),
  u64('loanPrincipalAmount'),
  u64('loanDuration'),
  u64('interestRate'),
  publicKey('loanDenomination'),
  publicKey('tmpDenominationAccountPubkey'),
  u8('status'),
  u64('paidAt'),
  u64('paidAmount'),
]);

export const INIT_OFFER_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('loan_id'),
  u64('loan_principal_amount'),
  u64('loan_duration'),
  u64('interest_rate'),
  publicKey('loan_denomination'),
]);

export const CANCEL_LOAN_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('loan_id'),
]);

export const CANCEL_OFFER_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('offer_id'),
]);

export const ACCEPT_OFFER_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('loan_id'),
  publicKey('offer_id'),
  u64('loan_principal_amount'),
  u64('loan_duration'),
  u64('interest_rate'),
  publicKey('loan_currency'),
]);

export const LIQUIDATE_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('loan_id'),
  publicKey('offer_id'),
]);

export const PAY_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('loan_id'),
  publicKey('offer_id'),
  u64('pay_amount'),
]);

export const CLOSE_OFFER_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('offer_id'),
]);

export const ORDER_NOW_INSTRUCTION_LAYOUT = struct([
  u8('instruction'),
  publicKey('loan_id'),
]);
