import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class LiquidateLoanNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
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
                methodName: "liquidate_overdue_loan",
                args: {
                  nft_contract_id: assetContractAddress,
                  token_id: assetTokenId
                },
                gas,
                deposit: 1,
              },
            }
          ]
        },
      ];

      this.saveStateBeforeRedirect({ contract_address: assetContractAddress, token_id: assetTokenId });

      const res = await window.nearSelector.signAndSendTransactions({ 
        transactions,
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }),
      });
      
      return this.handleSuccess(
        { txHash: res ? res[0].transaction.hash : '' } as TransactionResult,
        assetContractAddress,
        assetTokenId,
      );
    } catch (err) {
      return this.handleError(err);
    }
  }
}
