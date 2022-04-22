import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class CancelLoanNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
  ): Promise<TransactionResult> {
    try {
      const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();

      const gas = await this.calculateGasFee();
      await account.functionCall({
        contractId: this.lendingProgram,
        methodName: 'cancel_loan',
        args: {
          nft_contract_id: assetContractAddress,
          token_id: assetTokenId
        },
        gas,
        attachedDeposit: 1,
      });
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
