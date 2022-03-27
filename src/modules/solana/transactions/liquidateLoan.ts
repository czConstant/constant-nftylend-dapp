import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { PublicKey, Transaction, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';

import { TransactionResult } from 'src/modules/nftLend/models/transaction';

import { getLendingProgramId } from './constants';
import { LiquidateInstruction } from './utils';
import SolTransaction from './index';

export default class LiquidateLoanTransaction extends SolTransaction {
  async run(
    nftMint: string,
    borrowerPubkey: string,
    loanDataAddress: string,
    offerDataAddress: string,
    pdaTokenAccount: string,
    pdaNftAccount: string,
  ): Promise<TransactionResult> {
    this.prepareRun();

    try {
      const lendingProgramId = new PublicKey(getLendingProgramId());
      const nft_mint_pubkey = new PublicKey(nftMint);
      const borrower_pubkey = new PublicKey(borrowerPubkey);

      const loan_id = new PublicKey(loanDataAddress);
      const offer_id = new PublicKey(offerDataAddress);
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
