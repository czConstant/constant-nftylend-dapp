import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';

import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getLendingProgramId } from './constants';
import { AcceptOfferInstruction } from './utils';
import SolTransaction from './index';

export default class AcceptOfferTransaction extends SolTransaction {
  async run(
    currencyMint: string,
    curerncyAssociated: string,
    loanDataAddress: string,
    offerDataAddress: string,
    currencyDataAddress: string,
    lender: string,
    principal: number,
    rate: number,
    duration : number,
  ): Promise<TransactionResult> {
    this.prepareRun();
    
    try {
      const lendingProgramId = new PublicKey(getLendingProgramId());
      const borrower_usd_account_pubkey = new PublicKey(curerncyAssociated);
      const usd_mint_pubkey = new PublicKey(currencyMint);

      const loan_id = new PublicKey(loanDataAddress);
      const offer_id = new PublicKey(offerDataAddress);
      const pda_token_account = new PublicKey(currencyDataAddress);
      const lender_pubkey = new PublicKey(lender);

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
        principal,
        duration,
        rate,
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
