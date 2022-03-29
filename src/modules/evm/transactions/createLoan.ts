import { ethers } from 'ethers';
import web3 from 'web3';

import IERC721 from '../abi/IERC721.json';

import EvmTransaction from './index';
import { Chain, ChainPolygonID } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { generateNonce, getChainIdByChain } from '../utils';

export default class CreateLoanEvmTransaction extends EvmTransaction {
  async run(
    nftTokenId: string,
    nftContractAddress: string,
    ownerAddress: string,
    principal: number,
    rate: number,
    duration: number,
    currencyId: number,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(nftContractAddress, IERC721.abi, signer)
      let txHash = '';
      if (!contract.isApprovedForAll()) {
        const tx = await contract.setApprovalForAll(this.lendingProgram, true);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      }
      const nonce = generateNonce();
      const borrowerMsg = web3.utils.soliditySha3(
        nftTokenId,
        nonce,
        nftContractAddress,
        ownerAddress,
        getChainIdByChain(this.chain),
      );
      if (!borrowerMsg) throw new Error('Empty borrow message');
      const borrowerSig = await signer.signMessage(borrowerMsg)

      await api.post(API_URL.NFT_LEND.CREATE_LOAN, {
        chain: this.chain.toString(),
        borrower: ownerAddress,
        currency_id: currencyId,
        principal_amount: principal,
        interest_rate: rate,
        duration: duration,
        contract_address: nftContractAddress,
        token_id: nftTokenId,
        signature: borrowerSig,
        nonce_hex: nonce,
      });

      return this.handleSuccess({ txHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
