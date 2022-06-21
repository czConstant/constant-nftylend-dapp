import BigNumber from 'bignumber.js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { APP_URL } from 'src/common/constants/url';
import { timestampAfter } from '@nftpawn-js/core';

export default class PayLoanNearTransaction extends NearTransaction {
  async run(
    payAmount: number | string,
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

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'pay_back_loan',
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_at: timestampAfter(0),
      });

      const transactions = [
        {
          receiverId: currencyContractAddress,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "ft_transfer_call",
                args: {
                  receiver_id: this.lendingProgram,
                  amount: new BigNumber(payAmount).multipliedBy(10 ** currencyDecimals).toString(10),
                  msg,
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
