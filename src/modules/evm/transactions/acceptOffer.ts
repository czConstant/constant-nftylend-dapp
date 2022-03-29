import { ethers } from 'ethers';
import web3 from 'web3';

import NftyPawn from '../abi/NFTPawn.json';

import EvmTransaction from './index';
import { ChainPolygonID } from 'src/common/constants/network';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

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
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      
      const fee = await contract.adminFeeInBasisPoints();
      const adminFee = web3.utils.toDecimal(fee);

      const tx = await contract.beginLoan(
        principal * 10 ** currencyDecimals,
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
