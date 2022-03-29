import { ethers } from 'ethers';
import web3 from 'web3';

import IERC20 from '../abi/IERC20.json';

import EvmTransaction from './index';
import { ChainPolygonID } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';
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
    currencyDecimals: number,
    lender: string,
    loanId: number,
    adminFee : number,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(currencyContractAddress, IERC20.abi, signer)
      const tx = await contract.approve(this.lendingProgram, web3.utils.toWei('1000000', 'ether'));
      const receipt = await tx.wait();
      
      const nonce = generateNonce();
      let lenderMsg = web3.utils.soliditySha3(
        principal * 10 ** currencyDecimals,
        assetTokenId,
        duration,
        rate * 10000,
        adminFee,
        nonce,
        assetContractAddress,
        currencyContractAddress,
        lender,
        ChainPolygonID,
      );
      if (!lenderMsg) throw new Error('Empty borrow message');
      const lenderSig = await signer.signMessage(lenderMsg)

      await api.post(`${API_URL.NFT_LEND.CREATE_OFFER}/${loanId}`, {
        lender,
        principal_amount: principal,
        interest_rate: rate,
        duration,
        signature: lenderSig,
        nonce_hex: nonce,
      });

      return this.handleSuccess({
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
