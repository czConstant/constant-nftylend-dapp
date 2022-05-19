import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { APP_URL } from 'src/common/constants/url';

export default class CancelLoanNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();
      const transaction = {
        receiverId: this.lendingProgram,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: "cancel_loan",
              args: {
                nft_contract_id: assetContractAddress,
                token_id: assetTokenId
              },
              gas,
              deposit: 1,
            },
          }
        ]
      };

      this.saveStateBeforeRedirect({ contract_address: assetContractAddress, token_id: assetTokenId });

      const res = await window.nearSelector.signAndSendTransactions({ 
        transactions: [transaction],
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }, `${window.location.origin}${APP_URL.NFT_LENDING_MY_NFT}`),
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
