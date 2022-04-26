import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import IERC20 from '../abi/IERC20.json';
import NftyPawn from '../abi/NFTPawn.json';

import EvmTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getMaxAllowance } from '../utils';

export default class PayLoanEvmTransaction extends EvmTransaction {
  async run(
    loanDataAddress: string,
    borrower: string,
    payAmount: number,
    currencyContractAddress: string,
    currencyDecimals: number,
  ): Promise<TransactionResult> {
    try {
      const signer = this.provider.getSigner(0);

      const erc20contract = new ethers.Contract(currencyContractAddress, IERC20.abi, signer)
      const allowance = await erc20contract.allowance(borrower, this.lendingProgram);
      
      const amount = new BigNumber(payAmount).multipliedBy(10 ** currencyDecimals);

      if (new BigNumber(allowance._hex).lt(amount)) {
        const tx = await erc20contract.approve(this.lendingProgram, getMaxAllowance());
        await tx.wait();
      }

      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      const tx = await contract.payBackLoan(loanDataAddress);
      const receipt = await tx.wait();
      return this.handleSuccess({
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
