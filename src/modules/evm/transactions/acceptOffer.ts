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
    lender: string,
    borrowerNonce: string,
    lenderNonce: string,
    adminFee : number,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(this.lendingProgram, NftyPawn.abi, signer)
      
      const borrowerMsg = web3.utils.soliditySha3(
        assetTokenId,
        borrowerNonce,
        assetContractAddress,
        borrower,
        ChainPolygonID,
      );
      if (!borrowerMsg) throw new Error('Empty borrow message');
      const borrowerSig = await signer.signMessage(borrowerMsg)
      const lenderMsg = web3.utils.soliditySha3(
        principal * 10 ** currencyDecimals,
        assetTokenId,
        duration,
        rate * 10000,
        adminFee,
        lenderNonce,
        assetContractAddress,
        currencyContractAddress,
        lender,
        ChainPolygonID,
      );
      if (!lenderMsg) throw new Error('Empty lender message');
      const lenderSig = await signer.signMessage(lenderMsg);
      console.log("🚀 ~ file: acceptOffer.ts ~ line 55 ~ AcceptOfferEvmTransaction ~ lenderSig", lenderSig)
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
        [borrowerSig, lenderSig],
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
