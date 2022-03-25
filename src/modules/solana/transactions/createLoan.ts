import {
  AccountLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction, createInitializeAccountInstruction, createTransferInstruction
} from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js';

import { getLendingProgramId, LOAN_INFO_LAYOUT } from './constants';
import { InitLoanInstruction } from './utils';
import SolTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

interface LoanInfo {
  principal: number;
  rate: number;
  duration: number; // days
}

export default class CreateLoanSolTransaction extends SolTransaction {
  async run(
    nftMint: string,
    borrowerNftAssociated: string,
    tokenMint: string,
    borrowerTokenAssociated: string,
    loanInfo: LoanInfo,
  ): Promise<TransactionResult> {
    if (!this.wallet.publicKey) throw new Error('No public key');
    try {
      const lendingProgramId = new PublicKey(getLendingProgramId());
      const borrower_nft_account_pubkey = new PublicKey(
        borrowerNftAssociated,
      );
      const borrower_usd_account_pubkey = new PublicKey(
        borrowerTokenAssociated,
      );
      const nft_mint_pubkey = new PublicKey(nftMint);
      const usd_mint_pubkey = new PublicKey(tokenMint);
      const temp_nft_account = Keypair.generate();

      const tx = new Transaction({ feePayer: this.wallet.publicKey });

      /* Check if token associated account of borrower is init or not */
      const tokenAssociatedAcc = await this.connection.getAccountInfo(borrower_usd_account_pubkey);
      if (tokenAssociatedAcc === null || tokenAssociatedAcc.data.length === 0) {
        const createAssTokenAccountIx = createAssociatedTokenAccountInstruction(
          this.wallet.publicKey,
          borrower_usd_account_pubkey,
          this.wallet.publicKey,
          usd_mint_pubkey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        tx.add(createAssTokenAccountIx);
      }
      /* End */

      const createTempTokenAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        ),
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: temp_nft_account.publicKey,
      });

      const initTempAccountIx = createInitializeAccountInstruction(
        temp_nft_account.publicKey,
        nft_mint_pubkey,
        this.wallet.publicKey,
        TOKEN_PROGRAM_ID,
      );

      const transferXTokensToTempAccIx = createTransferInstruction(
        borrower_nft_account_pubkey,
        temp_nft_account.publicKey,
        this.wallet.publicKey,
        1,
        [],
        TOKEN_PROGRAM_ID,
      );

      const loan_info_account = new Keypair();
      const createLoanAccountIx = SystemProgram.createAccount({
        space: LOAN_INFO_LAYOUT.span,
        lamports: await this.connection.getMinimumBalanceForRentExemption(
          LOAN_INFO_LAYOUT.span,
        ),
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: loan_info_account.publicKey,
        programId: lendingProgramId,
      });

      const initLoanIx = InitLoanInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        temp_nft_account.publicKey,
        borrower_usd_account_pubkey,
        loan_info_account.publicKey,
        SYSVAR_RENT_PUBKEY,
        TOKEN_PROGRAM_ID,

        loanInfo.principal,
        loanInfo.duration,
        loanInfo.rate,
        nft_mint_pubkey,
        usd_mint_pubkey,
      );

      tx.add(
        createTempTokenAccountIx,
        initTempAccountIx,
        transferXTokensToTempAccIx,
        createLoanAccountIx,
        initLoanIx,
      );

      tx.recentBlockhash = (
        await this.connection.getLatestBlockhash()
      ).blockhash;

      const txHash = await this.wallet.sendTransaction(tx, this.connection, {
        signers: [temp_nft_account, loan_info_account],
      });

      return this.handleSuccess({ txHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
