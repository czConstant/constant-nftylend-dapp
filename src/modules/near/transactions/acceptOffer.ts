import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class AcceptOfferNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    offerId: number,
  ): Promise<TransactionResult> {
    try {
      const connection = new nearAPI.WalletConnection(window.near, null);
      const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();

      const gas = await this.calculateGasFee();
      const transactions = [
        account.functionCall({
          contractId: this.lendingProgram,
          methodName: 'accept_offer',
          args: {
            nft_contract_id: assetContractAddress,
            token_id: assetTokenId,
            offer_id: offerId,
          },
          gas,
          attachedDeposit: 1,
        }),
      ];
      await connection.requestSignTransactions({ transactions })
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
