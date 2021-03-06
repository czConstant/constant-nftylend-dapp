import { ethers } from 'ethers';

import NftyPawn from '../abi/NFTPawn.json';

import EvmTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import BigNumber from 'bignumber.js';

export default class AcceptOfferEvmTransaction extends EvmTransaction {
  async run(
    principal: number,
    assetTokenId: string,
    duration: number,
    rate: number,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    borrower: string,
    borrowerNonce: string,
    borrowerSignature: string,
    lender: string,
    lenderNonce: string,
    lenderSignature: string,
  ): Promise<TransactionResult> {
    try {
      const signer = this.provider.getSigner(0);
      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      
      const adminFee = await this.getAdminFee();

      const principalStr = `${new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString()}`;

      const tx = await contract.beginLoan(
        principalStr,
        assetTokenId,
        duration,
        rate * 10000,
        adminFee,
        [borrowerNonce, lenderNonce],
        assetContractAddress,
        currencyContractAddress,
        lender,
        [borrowerSignature, lenderSignature],
        { from: borrower },
      );
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
