import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PublicKey, Transaction, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';

import { LENDING_PROGRAM_ID } from './constants';
import { LiquidateInstruction } from './utils';
import SolTransaction from './index';

export default class LiquidateLoanTransaction extends SolTransaction {
  async run(
    nftMint: string,
    borrowerPubkey: string,
    loanId: string,
    offerId: string,
    pdaTokenAccount: string,
    pdaNftAccount: string,
  ) {
    if (!this.wallet.publicKey) return;

    try {
      const lendingProgramId = new PublicKey(LENDING_PROGRAM_ID);
      const nft_mint_pubkey = new PublicKey(nftMint);
      const borrower_pubkey = new PublicKey(borrowerPubkey);

      const loan_id = new PublicKey(loanId);
      const offer_id = new PublicKey(offerId);
      const pda_token_account = new PublicKey(pdaTokenAccount);
      const pda_nft_account = new PublicKey(pdaNftAccount);

      const tx = new Transaction({ feePayer: this.wallet.publicKey });

      // create assosiate account if haven't yet
      const lenderNftAssociated = (
        await PublicKey.findProgramAddress(
          [this.wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nft_mint_pubkey.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID,
        )
      )[0];

      const createAssTokenAccountIx = createAssociatedTokenAccountInstruction(
        this.wallet.publicKey,
        lenderNftAssociated,
        this.wallet.publicKey,
        nft_mint_pubkey,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const assosiatedAccountInfo = await this.connection.getAccountInfo(
        new PublicKey(lenderNftAssociated)
      );
      if (assosiatedAccountInfo === null || assosiatedAccountInfo.data.length === 0) {
        console.log("Assosiated account have not initialized");
        tx.add(createAssTokenAccountIx);
      }

      const PDA = await PublicKey.findProgramAddress([Buffer.from('lending')], lendingProgramId);
      const liquidateTx = LiquidateInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        borrower_pubkey,
        loan_id,
        offer_id,
        lenderNftAssociated,
        pda_nft_account,
        pda_token_account,
        TOKEN_PROGRAM_ID,
        PDA[0],
        SYSVAR_CLOCK_PUBKEY,
      );

      tx.add(liquidateTx);
      tx.recentBlockhash = (
        await this.connection.getLatestBlockhash()
      ).blockhash;

      const txHash = await this.wallet.sendTransaction(tx, this.connection, {
        signers: [],
      });

      return this.handleSuccess({ txHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
