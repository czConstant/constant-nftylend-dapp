import BigNumber from 'bignumber.js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { APP_URL } from 'src/common/constants/url';

export default class PayLoanNearNativeTransaction extends NearTransaction {
  async run(
    payAmount: number,
    assetTokenId: string,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    principal: number,
    rate: number,
    duration: number,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();

      const amount =  new BigNumber(payAmount).multipliedBy(10 ** currencyDecimals).toString(10)

      const transactions = [
        {
          receiverId: this.lendingProgram,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "pay_back_loan_by_near",
                args: {
                  nft_contract_id: assetContractAddress,
                  token_id: assetTokenId,
                },
                gas,
                deposit: amount,
              },
            }
          ]
        },
      ];

      this.saveStateBeforeRedirect({ contract_address: assetContractAddress, token_id: assetTokenId });

      const res = await window.nearSelector.signAndSendTransactions({ 
        transactions,
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }, `${window.location.origin}${APP_URL.DASHBOARD}/loans`),
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
