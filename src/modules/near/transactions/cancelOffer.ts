import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class CancelOfferNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    offerId: number,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();

      const transactions = [
        {
          receiverId: this.lendingProgram,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "cancel_offer",
                args: {
                  nft_contract_id: assetContractAddress,
                  token_id: assetTokenId,
                  offer_id: offerId, 
                },
                gas,
                deposit: 1,
              },
            }
          ]
        },
      ];

      const res = await window.nearSelector.signAndSendTransactions({ 
        transactions,
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }),
      });
      
      return this.handleSuccess(
        { txHash: res[0].transaction.hash } as TransactionResult,
        assetContractAddress,
        assetTokenId,
      );
    } catch (err) {
      return this.handleError(err);
    }
  }
}
