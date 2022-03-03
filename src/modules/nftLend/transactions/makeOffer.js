import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';

import { LENDING_PROGRAM_ID, OFFER_INFO_LAYOUT } from './constants';
import { InitOfferInstruction } from './utils';
import SolTransaction from './index';

export default class MakeOfferTransaction extends SolTransaction {
  async run(
    sendTokenMint /* string */,
    sendTokenAssociated /* string */,
    borrowerAddress /* string */,
    loanAddress /* string */,
    principal /* number */,
    interest /* number */,
    duration /* number */,
  ) {
    try {
      const lendingProgramId = new PublicKey(LENDING_PROGRAM_ID);
      const loan_id = new PublicKey(loanAddress);
      const lender_usd_account_pubkey = new PublicKey(sendTokenAssociated);
      const usd_mint_pubkey = new PublicKey(sendTokenMint);
      const borrow_account = new PublicKey(borrowerAddress);

      const temp_usd_account = new Keypair();

      const createTempTokenAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        ),
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: temp_usd_account.publicKey,
      });

      const initTempAccountIx = Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        usd_mint_pubkey,
        temp_usd_account.publicKey,
        this.wallet.publicKey,
      );

      const transferUsdToTempAccIx = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        lender_usd_account_pubkey,
        temp_usd_account.publicKey,
        this.wallet.publicKey,
        [],
        principal,
      );

      const offer_info_account = new Keypair();
      const createOfferAccountIx = SystemProgram.createAccount({
        space: OFFER_INFO_LAYOUT.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          OFFER_INFO_LAYOUT.span,
        ),
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: offer_info_account.publicKey,
        programId: lendingProgramId,
      });

      const initOfferIx = InitOfferInstruction(
        lendingProgramId,
        borrow_account,
        this.wallet.publicKey,
        temp_usd_account.publicKey,
        offer_info_account.publicKey,
        SYSVAR_RENT_PUBKEY,
        TOKEN_PROGRAM_ID,

        loan_id,
        principal,
        duration,
        interest,
        usd_mint_pubkey,
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        createTempTokenAccountIx,
        initTempAccountIx,
        transferUsdToTempAccIx,
        createOfferAccountIx,
        initOfferIx,
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
