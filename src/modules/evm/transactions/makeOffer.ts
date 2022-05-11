import { ethers } from 'ethers';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

import IERC20 from '../abi/IERC20.json';

import EvmTransaction from './index';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { formatAmountSigning, generateNonce, getMaxAllowance } from '../utils';
import { getAvailableAt } from 'src/modules/nftLend/utils';

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
    availableIn: number,
  ): Promise<TransactionResult> {
    try {
      const signer = this.provider.getSigner(0);
      const contract = new ethers.Contract(currencyContractAddress, IERC20.abi, signer)
      
      let txHash = '';
      const allowance = await contract.allowance(lender, this.lendingProgram);
      if (new BigNumber(allowance._hex).lt(principal)) {
        const tx = await contract.approve(this.lendingProgram, getMaxAllowance());
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      }
      const chainId = (await this.provider.getNetwork()).chainId;
      const nonce = generateNonce();
      const adminFee = await this.getAdminFee();

      const principalStr = formatAmountSigning(principal, currencyDecimals);
      const rateStr = `${new BigNumber(rate).multipliedBy(10000).toString()}`;

      let lenderMsg = web3.utils.soliditySha3(
        principalStr,
        assetTokenId,
        duration,
        rateStr,
        adminFee,
        nonce,
        assetContractAddress,
        currencyContractAddress,
        lender,
        chainId,
      );
      const lenderSig = await this.signMessage(signer, lenderMsg || '');

      await api.post(`${API_URL.NFT_LEND.CREATE_OFFER}/${loanId}`, {
        lender,
        principal_amount: String(principal),
        interest_rate: rate,
        duration,
        signature: lenderSig,
        nonce_hex: nonce,
        available_at: getAvailableAt(availableIn),
      });

      return this.handleSuccess({ txHash: txHash } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
        
  }
}
