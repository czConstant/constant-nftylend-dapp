import { ethers } from 'ethers';
import { customAlphabet } from 'nanoid';
import web3 from 'web3';

import { POLYGON_DELEND_PROGRAM } from 'src/common/constants/config';
import { CreateLoanInfo } from 'src/modules/nftLend/transactions/createLoan';
import IERC721 from '../abi/IERC721.json';

import EvmTransaction from './index';
import { Chain, ChainPolygonID } from 'src/common/constants/network';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class CreateLoanEvmTransaction extends EvmTransaction {
  async run(
    nftTokenId: string,
    nftContractAddress: string,
    ownerAddress: string,
    loanInfo: CreateLoanInfo,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(nftContractAddress, IERC721.abi, signer)
      let txHash = '';
      if (!contract.isApprovedForAll()) {
        const tx = await contract.setApprovalForAll(POLYGON_DELEND_PROGRAM, true);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      }
      const nonce = '0x' + customAlphabet('0123456789abcdef', 64)();
      const borrowerMg = web3.utils.soliditySha3(
        nftTokenId,
        nonce,
         nftContractAddress,
        ownerAddress,
        ChainPolygonID
      );
      if (!borrowerMg) throw new Error('Emppty borrow message');
      const borrowerSig = await signer.signMessage(borrowerMg)

      await api.post(API_URL.NFT_LEND.CREATE_LOAN, {
        chain: Chain.Polygon.toString(),
        borrower: ownerAddress,
        currency_id: loanInfo.currency_id,
        principal_amount: loanInfo.principal,
        interest_rate: loanInfo.rate,
        duration: loanInfo.duration,
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
