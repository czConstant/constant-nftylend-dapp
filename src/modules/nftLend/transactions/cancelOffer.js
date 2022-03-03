import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

import { LENDING_PROGRAM_ID } from './constants';
import { CancelOfferInstruction } from './utils';
import SolTransaction from './index';

export default class CancelOfferTransaction extends SolTransaction {
  async run(
    receiveTokenAssociated /* string */,
    offerAddress /* string */,
    offerTokenAddress /* string */,
  ) {
    try {
      const lendingProgramId = new PublicKey(LENDING_PROGRAM_ID);

      const receive_token_account_pubkey = new PublicKey(
        receiveTokenAssociated,
      );
      const offer_id = new PublicKey(offerAddress);
      const pda_token_account_pubkey = new PublicKey(offerTokenAddress);

      const PDA = await PublicKey.findProgramAddress(
        [Buffer.from('lending')],
        lendingProgramId,
      );
      const cancelOfferTx = CancelOfferInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        offer_id,
        pda_token_account_pubkey,
        receive_token_account_pubkey,
        TOKEN_PROGRAM_ID,
        PDA[0],
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        cancelOfferTx,
      );
      tx.recentBlockhash = (
        await this.connection.getRecentBlockhash()
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
