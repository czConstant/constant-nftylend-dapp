import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import { POLYGON_DELEND_PROGRAM } from 'src/common/constants/config';
import NftyPawn from '../abi/nftypawn.json';

import EvmTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class CancelLoanEvmTransaction extends EvmTransaction {
  async run(
    nonce: string,
  ): Promise<TransactionResult> {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      const contract = new ethers.Contract(POLYGON_DELEND_PROGRAM, NftyPawn, signer)
      const tx = await contract.cancelLoanCommitmentBeforeLoanHasBegun('0x' + nonce);
      const receipt = await tx.wait();

      return this.handleSuccess({ txHash: receipt.transactionHash });
    } catch (err) {
      return this.handleError(err);
    }
  }
}
