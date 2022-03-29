import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';

import { CancelLoanInstruction } from './utils';
import SolTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class CancelLoanTransaction extends SolTransaction {
  async run(
    receiveNftAssociated: string,
    loanId: string,
    nftTempAccountAddress: string
  ): Promise<TransactionResult> {
    this.prepareRun();
    try {
      const lendingProgramId = new PublicKey(this.lendingProgram);
      const borrower_nft_account_pubkey = new PublicKey(receiveNftAssociated);
      const loan_info_account_pubkey = new PublicKey(loanId);
      const temp_nft_account_pubkey = new PublicKey(nftTempAccountAddress);

      const PDA = await PublicKey.findProgramAddress(
        [Buffer.from('lending')],
        lendingProgramId,
      );
      const cancelLoanTx = CancelLoanInstruction(
        lendingProgramId,
        this.wallet.publicKey,
        loan_info_account_pubkey,
        temp_nft_account_pubkey,
        borrower_nft_account_pubkey,
        TOKEN_PROGRAM_ID,
        PDA[0],
      );

      const tx = new Transaction({ feePayer: this.wallet.publicKey }).add(
        cancelLoanTx,
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
