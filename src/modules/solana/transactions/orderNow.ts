import { AccountLayout, createInitializeAccountInstruction, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
} from '@solana/web3.js';

import { OFFER_INFO_LAYOUT } from './constants';
import { OrderNowInstruction } from './utils';
import SolTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class OrderNowTransaction extends SolTransaction {
  async run(
    tokenMint: string,
    loanAddress: string,
    principal: number,
    borrowerTokenAssociated: string,
    borrowerAddress: string,
    lenderTokenAssociated: string,
  ): Promise<TransactionResult> {
    this.prepareRun();
    
    try {
      const lendingProgramId = new PublicKey(this.lendingProgram);
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

      const initTempAccountIx = createInitializeAccountInstruction(
        temp_usd_account.publicKey,
        usd_mint_pubkey,
        this.wallet.publicKey,
        TOKEN_PROGRAM_ID,
      );

      const transferUsdToTempAccIx = createTransferInstruction(
        lender_usd_account_pubkey,
        temp_usd_account.publicKey,
        this.wallet.publicKey,
        Number(principal),
        [],
        TOKEN_PROGRAM_ID,
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
        await this.connection.getLatestBlockhash()
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
