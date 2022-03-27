import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

import { getLendingProgramId } from './constants';
import { CloseOfferInstruction } from './utils';
import SolTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class CloseOfferTransaction extends SolTransaction {
  async run(
    offerDataAddress: string,
    pdaTokenAccount: string,
    lenderUsdAssociated: string,
  ): Promise<TransactionResult> {
    this.prepareRun();
    
    try {
      const lendingProgramId = new PublicKey(getLendingProgramId());
      const offer_id = new PublicKey(offerDataAddress);
      const pda_token_account = new PublicKey(pdaTokenAccount);
      const lender_token_account_pubkey = new PublicKey(lenderUsdAssociated);

      const PDA = await PublicKey.findProgramAddress([Buffer.from('lending')], lendingProgramId);
      const closeOfferInstructionTx = CloseOfferInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        offer_id,
        lender_token_account_pubkey,
        pda_token_account,
        TOKEN_PROGRAM_ID,
        PDA[0]
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        closeOfferInstructionTx,
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
