import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js';

import { LENDING_PROGRAM_ID, OFFER_INFO_LAYOUT } from './constants';
import { OrderNowInstruction } from './utils';
import SolTransaction from './index';

export default class OrderNowTransaction extends SolTransaction {
  async run(
    tokenMint /* string */,
    borrowerTokenAssociated /* string */,
    borrowerAddress /* string */,
    loanAddress /* string */,
    lenderTokenAssociated /* string */,
    principal /* number */,
  ) {
    try {
      const lendingProgramId = new PublicKey(LENDING_PROGRAM_ID);
      const borrower_usd_pubkey = new PublicKey(borrowerTokenAssociated);
      const borrower_pubkey = new PublicKey(borrowerAddress);
      const loan_id = new PublicKey(loanAddress);
      const lender_usd_account_pubkey = new PublicKey(lenderTokenAssociated);
      const usd_mint_pubkey = new PublicKey(tokenMint);

      const temp_usd_account = new Keypair();

      const PDA = await PublicKey.findProgramAddress(
        [Buffer.from('lending')],
        lendingProgramId
      );
      const createTempTokenAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          AccountLayout.span
        ),
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: temp_usd_account.publicKey,
      });

      const initTempAccountIx = Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        usd_mint_pubkey,
        temp_usd_account.publicKey,
        this.wallet.publicKey
      );

      const transferUsdToTempAccIx = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        lender_usd_account_pubkey,
        temp_usd_account.publicKey,
        this.wallet.publicKey,
        [],
        Number(principal),
      );

      const offer_info_account = new Keypair();
      const createOfferAccountIx = SystemProgram.createAccount({
        space: OFFER_INFO_LAYOUT.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          OFFER_INFO_LAYOUT.span
        ),
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: offer_info_account.publicKey,
        programId: lendingProgramId,
      });

      const initOrderIx = OrderNowInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        borrower_pubkey,
        loan_id,
        borrower_usd_pubkey,
        temp_usd_account.publicKey,
        offer_info_account.publicKey,
        SYSVAR_RENT_PUBKEY,
        TOKEN_PROGRAM_ID,
        PDA[0],
        SYSVAR_CLOCK_PUBKEY,
        loan_id,
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        createTempTokenAccountIx,
        initTempAccountIx,
        transferUsdToTempAccIx,
        createOfferAccountIx,
        initOrderIx
      );

      tx.recentBlockhash = (
        await this.connection.getRecentBlockhash()
      ).blockhash;

      const txHash = await this.wallet.sendTransaction(tx, this.connection, {
        signers: [temp_usd_account, offer_info_account],
      });

      return this.handleSuccess({ txHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
