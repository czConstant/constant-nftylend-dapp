import { ethers } from 'ethers';

import NftyPawn from '../abi/NFTPawn.json';

import EvmTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class PayLoanEvmTransaction extends EvmTransaction {
  async run(
    loanId: string,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      const tx = await contract.payBackLoan(loanId);
      const receipt = await tx.wait();

      return this.handleSuccess({ txHash: receipt.transactionHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
