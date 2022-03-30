import { ethers } from 'ethers';
import web3 from 'web3';

import IERC721 from '../abi/IERC721.json';

import EvmTransaction from './index';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { generateNonce } from '../utils';

export default class CreateLoanEvmTransaction extends EvmTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    ownerAddress: string,
    principal: number,
    rate: number,
    duration: number,
    currencyId: number,
    currencyContractAddress: string,
    currencyDecimals: number,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(assetContractAddress, IERC721.abi, signer)
      let txHash = '';
      if (!(await contract.isApprovedForAll(ownerAddress, this.lendingProgram))) {
        const tx = await contract.setApprovalForAll(this.lendingProgram, true);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      }
      const chainId = (await provider.getNetwork()).chainId;
      const nonce = generateNonce();
      const adminFee = await this.getAdminFee();
      
      let borrowerMsg = web3.utils.soliditySha3(
        principal * 10 ** currencyDecimals,
        assetTokenId,
        duration,
        rate * 10000,
        adminFee,
        nonce,
        assetContractAddress,
        currencyContractAddress,
        ownerAddress,
        chainId,
      );
      const borrowerSig = await this.signMessage(signer, borrowerMsg || '');
      
      await api.post(API_URL.NFT_LEND.CREATE_LOAN, {
        chain: this.chain.toString(),
        borrower: ownerAddress,
        currency_id: currencyId,
        principal_amount: principal,
        interest_rate: rate,
        duration: duration,
        contract_address: assetContractAddress,
        token_id: assetTokenId,
        signature: borrowerSig,
        nonce_hex: nonce,
      });

      return this.handleSuccess({ txHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
