import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';

import { getLendingProgramId } from './constants';
import { AcceptOfferInstruction } from './utils';
import SolTransaction from './index';

export default class AcceptOfferTransaction extends SolTransaction {
  async run(
    usdAccountAddress: string,
    usdTokenMint: string,
    loanInfo: any,
    offerInfo: any,
  ) {
    if (!this.wallet.publicKey) return;

    try {
      const lendingProgramId = new PublicKey(getLendingProgramId());
      const borrower_usd_account_pubkey = new PublicKey(usdAccountAddress);
      const usd_mint_pubkey = new PublicKey(usdTokenMint);

      const loan_id = new PublicKey(loanInfo.id);
      const offer_id = new PublicKey(offerInfo.id);
      const pda_token_account = new PublicKey(offerInfo.token_account_id);
      const lender_pubkey = new PublicKey(
        offerInfo.lender_usd_associated,
      );

      const PDA = await PublicKey.findProgramAddress(
        [Buffer.from('lending')],
        lendingProgramId,
      );
      const acceptOfferTx = AcceptOfferInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        lender_pubkey,
        loan_id,
        borrower_usd_account_pubkey,
        offer_id,
        pda_token_account,
        TOKEN_PROGRAM_ID,
        PDA[0],
        SYSVAR_CLOCK_PUBKEY,
        loanInfo.principal,
        loanInfo.duration,
        loanInfo.rate,
        usd_mint_pubkey,
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        acceptOfferTx,
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