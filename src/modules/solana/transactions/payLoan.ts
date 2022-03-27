import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';

import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getLendingProgramId } from './constants';
import { PayInstruction } from './utils';
import SolTransaction from './index';

export default class PayLoanTransaction extends SolTransaction {
  async run(
    payAmount: number,
    loanDataAddress: string,
    offerDataAddress: string,
    borrowerNftAssociated: string,
    borrowerUsdAssociated: string,
    lenderPubkey: string,
    pdaTokenAccount: string,
    pdaNftAccount: string,
    adminPubkey: string,
  ): Promise<TransactionResult> {
    this.prepareRun();

    try {
      const lendingProgramId = new PublicKey(getLendingProgramId());
      const borrower_nft_account_pubkey = new PublicKey(borrowerNftAssociated);
      const borrower_usd_account_pubkey = new PublicKey(borrowerUsdAssociated);

      const loan_id = new PublicKey(loanDataAddress);
      const offer_id = new PublicKey(offerDataAddress);
      const pda_token_account = new PublicKey(pdaTokenAccount);
      const pda_nft_account = new PublicKey(pdaNftAccount);
      const lender_account_pubkey = new PublicKey(lenderPubkey);
      const admin_token_pubkey = new PublicKey(adminPubkey);

      const PDA = await PublicKey.findProgramAddress(
        [Buffer.from('lending')],
        lendingProgramId,
      );
      const payTx = PayInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        lender_account_pubkey,
        loan_id,
        offer_id,
        borrower_nft_account_pubkey,
        borrower_usd_account_pubkey,
        pda_nft_account,
        pda_token_account,
        admin_token_pubkey,
        TOKEN_PROGRAM_ID,
        PDA[0],
        SYSVAR_CLOCK_PUBKEY,
        payAmount,
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        payTx,
      );
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
