import { ethers } from 'ethers';
import { customAlphabet } from 'nanoid';
import web3 from 'web3';

import { POLYGON_DELEND_PROGRAM } from 'src/common/constants/config';
import NftyPawn from '../abi/NFTPawn.json';

import EvmTransaction from './index';
import { ChainPolygonID } from 'src/common/constants/network';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { generateNonce } from '../utils';

export default class MakeOfferEvmTransaction extends EvmTransaction {
  async run(
    principal: number,
    assetTokenId: string,
    duration: number,
    rate: number,
    assetContractAddress: string,
    currencyContractAddress: string,
    borrower: string,
    lender: string,
    adminFee : number,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(POLYGON_DELEND_PROGRAM, NftyPawn.abi, signer)
      
      const res = await signer.resolveName(POLYGON_DELEND_PROGRAM);
      const borrowerNonce = generateNonce();
      const lenderNonce = generateNonce();

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
        principal,
        assetTokenId,
        duration,
        rate,
        adminFee,
        lenderNonce,
        assetContractAddress,
        currencyContractAddress,
        lender,
        ChainPolygonID,
      );
      if (!lenderMsg) throw new Error('Empty lender message');
      const lenderSig = await signer.signMessage(lenderMsg);
      const tx = await contract.beginLoan(
        principal,
        assetTokenId,
        duration,
        rate,
        adminFee,
        [borrowerNonce, lenderNonce],
        assetContractAddress,
        currencyContractAddress,
        lender,
        [borrowerSig, lenderSig],
      );
      return this.handleSuccess({ txHash: tx.hash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
