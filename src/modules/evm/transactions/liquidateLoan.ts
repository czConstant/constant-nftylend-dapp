import { ethers } from 'ethers';

import NftyPawn from '../abi/NFTPawn.json';

import EvmTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class LiquidateLoanEvmTransaction extends EvmTransaction {
  async run(
    loanId: string,
  ): Promise<TransactionResult> {
    console.log("🚀 ~ file: liquidateLoan.ts ~ line 12 ~ LiquidateLoanEvmTransaction ~ loanId", loanId)
    try {
      const signer = this.provider.getSigner(0);
      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      const tx = await contract.liquidateOverdueLoan(loanId);
      const receipt = await tx.wait();

      return this.handleSuccess({
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      } as TransactionResult);
    } catch (err) {
      console.log("🚀 ~ file: liquidateLoan.ts ~ line 24 ~ LiquidateLoanEvmTransaction ~ err", err)
      return this.handleError(err);
    }
  }
}
