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
      const gas = await this.calculateGasFee();

      const action = nearAPI.transactions.functionCall(
        'accept_offer',
        Buffer.from(JSON.stringify({
          nft_contract_id: assetContractAddress,
          token_id: assetTokenId,
          offer_id: offerId,
        })),
        gas,
        1
      );
      const transaction = await this.createTransaction([ action ], this.lendingProgram);
      await connection.requestSignTransactions({ 
        transactions: [transaction],
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }),
      });

      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
