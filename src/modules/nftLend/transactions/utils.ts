import { PublicKey, TransactionInstruction } from '@solana/web3.js';

import {
  CANCEL_LOAN_INSTRUCTION_LAYOUT,
  CANCEL_OFFER_INSTRUCTION_LAYOUT,
  INIT_LOAN_INSTRUCTION_LAYOUT,
  INIT_OFFER_INSTRUCTION_LAYOUT,
  ACCEPT_OFFER_INSTRUCTION_LAYOUT,
  LIQUIDATE_INSTRUCTION_LAYOUT,
  PAY_INSTRUCTION_LAYOUT,
  CLOSE_OFFER_INSTRUCTION_LAYOUT,
  ORDER_NOW_INSTRUCTION_LAYOUT,
} from './constants';

export enum LendingInstruction {
  InitLoan = 0,
  MakeOffer = 1,
  AcceptOffer = 2,
  CancelLoan = 3,
  CancelOffer = 4,
  PayLoan = 5,
  Liquidate = 6,
  CloseOffer = 7,
  OrderNow = 8,
};

export function InitLoanInstruction(
  lending_program_id: PublicKey,
  borrower_account: PublicKey,
  borrower_temp_token_account: PublicKey,
  borrower_denomination_account: PublicKey,
  loan_info_account: PublicKey,
  sys_var_rent: PublicKey,
  token_program: PublicKey,
  loan_principal_amount: number,
  loan_duration: number,
  interest_rate: number,
  nft_collateral_contract: PublicKey,
  loan_currency: PublicKey,
) {
  const keys = [
    { pubkey: borrower_account, isSigner: true, isWritable: false },
    { pubkey: borrower_temp_token_account, isSigner: false, isWritable: true },
    { pubkey: borrower_denomination_account, isSigner: false, isWritable: false },
    { pubkey: loan_info_account, isSigner: false, isWritable: true },
    { pubkey: sys_var_rent, isSigner: false, isWritable: false },
    { pubkey: token_program, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(INIT_LOAN_INSTRUCTION_LAYOUT.span);
  INIT_LOAN_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.InitLoan,
      loan_principal_amount: BigInt(loan_principal_amount),
      loan_duration: BigInt(loan_duration),
      interest_rate: BigInt(interest_rate),
      nft_collateral_contract,
      loan_currency,
    },
    data,
  );

  return new TransactionInstruction({
    keys,
    programId: lending_program_id,
    data,
  });
}

export function InitOfferInstruction(
  lending_program_id: PublicKey,
  borrower_account: PublicKey,
  lender_account: PublicKey,
  lender_temp_token_account: PublicKey,
  offer_info_account: PublicKey,
  sys_var_rent: PublicKey,
  token_program: PublicKey,

  loan_id: PublicKey,
  loan_principal_amount: number,
  loan_duration: number,
  interest_rate: number,
  loan_currency: PublicKey,
  expired: number,
  ) {
  console.log("🚀 ~ file: utils.ts ~ line 86 ~ loan_currency", loan_currency)
  console.log("🚀 ~ file: utils.ts ~ line 86 ~ expired", expired)
  const keys = [
    { pubkey: lender_account, isSigner: true, isWritable: false },
    { pubkey: borrower_account, isSigner: false, isWritable: false },
    { pubkey: loan_id, isSigner: false, isWritable: true },
    { pubkey: lender_temp_token_account, isSigner: false, isWritable: true },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: sys_var_rent, isSigner: false, isWritable: false },
    { pubkey: token_program, isSigner: false, isWritable: false },
  ];
  const data = Buffer.alloc(INIT_OFFER_INSTRUCTION_LAYOUT.span);
  INIT_OFFER_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.MakeOffer,
      loan_id,
      loan_principal_amount: BigInt(loan_principal_amount),
      loan_duration: BigInt(loan_duration),
      interest_rate: BigInt(interest_rate),
      loan_currency,
      expired: BigInt(expired),
    },
    data
  );
  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function CancelLoanInstruction(
  lending_program_id: PublicKey,
  borrower_account: PublicKey,
  loan_info_account: PublicKey,
  pda_collateral_account: PublicKey,
  borrower_nft_account: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
) {
  const keys = [
    { pubkey: borrower_account, isSigner: true, isWritable: false },
    { pubkey: loan_info_account, isSigner: false, isWritable: true },
    { pubkey: pda_collateral_account, isSigner: false, isWritable: true },
    { pubkey: borrower_nft_account, isSigner: false, isWritable: true },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(CANCEL_LOAN_INSTRUCTION_LAYOUT.span);
  CANCEL_LOAN_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.CancelLoan,
      loan_id: loan_info_account,
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function CancelOfferInstruction(
  lending_program_id: PublicKey,
  lender_account: PublicKey,
  offer_info_account: PublicKey,
  pda_token_account: PublicKey,
  lender_token_account: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
) {
  const keys = [
    { pubkey: lender_account, isSigner: true, isWritable: false },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: pda_token_account, isSigner: false, isWritable: true },
    { pubkey: lender_token_account, isSigner: false, isWritable: true },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(CANCEL_OFFER_INSTRUCTION_LAYOUT.span);
  CANCEL_OFFER_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.CancelOffer,
      offer_id: offer_info_account,
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function AcceptOfferInstruction(
  lending_program_id: PublicKey,
  borrower_account: PublicKey,
  lender_account: PublicKey,
  loan_info_account: PublicKey,
  borrower_token_account: PublicKey,
  offer_info_account: PublicKey,
  pda_token_account: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
  sys_var_clock: PublicKey,
  loan_principal_amount: number,
  loan_duration: number,
  interest_rate: number,
  loan_currency: PublicKey,
) {
  const keys = [
    { pubkey: borrower_account, isSigner: true, isWritable: false },
    { pubkey: lender_account, isSigner: false, isWritable: false },
    { pubkey: loan_info_account, isSigner: false, isWritable: true },
    { pubkey: borrower_token_account, isSigner: false, isWritable: true },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: pda_token_account, isSigner: false, isWritable: true },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
    { pubkey: sys_var_clock, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(ACCEPT_OFFER_INSTRUCTION_LAYOUT.span);
  ACCEPT_OFFER_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.AcceptOffer,
      loan_id: loan_info_account,
      offer_id: offer_info_account,
      loan_principal_amount: BigInt(loan_principal_amount),
      loan_duration: BigInt(loan_duration),
      interest_rate: BigInt(interest_rate),
      loan_currency
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function LiquidateInstruction(
  lending_program_id: PublicKey,
  lender_account: PublicKey,
  borrower_account: PublicKey,
  loan_info_account: PublicKey,
  offer_info_account: PublicKey,
  lender_nft_account: PublicKey,
  pda_nft_account: PublicKey,
  pda_token_account: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
  sys_var_clock: PublicKey,
) {
  const keys = [
    { pubkey: lender_account, isSigner: true, isWritable: false },
    { pubkey: borrower_account, isSigner: false, isWritable: false },
    { pubkey: loan_info_account, isSigner: false, isWritable: true },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: lender_nft_account, isSigner: false, isWritable: true },
    { pubkey: pda_nft_account, isSigner: false, isWritable: true },
    { pubkey: pda_token_account, isSigner: false, isWritable: true },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
    { pubkey: sys_var_clock, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(LIQUIDATE_INSTRUCTION_LAYOUT.span);
  LIQUIDATE_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.Liquidate,
      loan_id: loan_info_account,
      offer_id: offer_info_account,
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function PayInstruction(
  lending_program_id: PublicKey,
  borrower_account: PublicKey,
  lender_account: PublicKey,
  loan_info_account: PublicKey,
  offer_info_account: PublicKey,
  borrower_nft_account: PublicKey,
  borrower_token_account: PublicKey,
  pda_nft_account: PublicKey,
  pda_token_account: PublicKey,
  admin_token_pubkey: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
  sys_var_clock: PublicKey,
  pay_amount: number,
) {
  const keys = [
    { pubkey: borrower_account, isSigner: true, isWritable: false },
    { pubkey: lender_account, isSigner: false, isWritable: false },
    { pubkey: loan_info_account, isSigner: false, isWritable: true },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: borrower_nft_account, isSigner: false, isWritable: true },
    { pubkey: borrower_token_account, isSigner: false, isWritable: true },
    { pubkey: pda_nft_account, isSigner: false, isWritable: true },
    { pubkey: pda_token_account, isSigner: false, isWritable: true },
    { pubkey: admin_token_pubkey, isSigner: false, isWritable: true },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
    { pubkey: sys_var_clock, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(PAY_INSTRUCTION_LAYOUT.span);
  PAY_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.PayLoan,
      loan_id: loan_info_account,
      offer_id: offer_info_account,
      pay_amount: BigInt(pay_amount),
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function CloseOfferInstruction(
  lending_program_id: PublicKey,
  lender_account: PublicKey,
  offer_info_account: PublicKey,
  lender_token_account: PublicKey,
  pda_token_account: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
) {
  const keys = [
    { pubkey: lender_account, isSigner: true, isWritable: false },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: lender_token_account, isSigner: false, isWritable: true },
    { pubkey: pda_token_account, isSigner: false, isWritable: true },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(CLOSE_OFFER_INSTRUCTION_LAYOUT.span);
  CLOSE_OFFER_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.CloseOffer,
      offer_id: offer_info_account,
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}

export function OrderNowInstruction(
  lending_program_id: PublicKey,
  lender_account: PublicKey,
  borrower_account: PublicKey,
  loan_info_account: PublicKey,
  borrower_token_account: PublicKey,
  lender_temp_token_account: PublicKey,
  offer_info_account: PublicKey,
  sys_var_rent: PublicKey,
  token_program: PublicKey,
  pda_account: PublicKey,
  sys_var_clock: PublicKey,
  loan_id: PublicKey,
) {
  const keys = [
    { pubkey: lender_account, isSigner: true, isWritable: false },
    { pubkey: borrower_account, isSigner: false, isWritable: false },
    { pubkey: loan_info_account, isSigner: false, isWritable: true },
    { pubkey: borrower_token_account, isSigner: false, isWritable: true },
    { pubkey: lender_temp_token_account, isSigner: false, isWritable: true },
    { pubkey: offer_info_account, isSigner: false, isWritable: true },
    { pubkey: sys_var_rent, isSigner: false, isWritable: false },
    { pubkey: token_program, isSigner: false, isWritable: false },
    { pubkey: pda_account, isSigner: false, isWritable: false },
    { pubkey: sys_var_clock, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(ORDER_NOW_INSTRUCTION_LAYOUT.span);
  ORDER_NOW_INSTRUCTION_LAYOUT.encode(
    {
      instruction: LendingInstruction.OrderNow,
      loan_id,
    },
    data
  );

  return new TransactionInstruction({ keys, programId: lending_program_id, data });
}
