import BigNumber from 'bignumber.js';
import * as nearAPI from "near-api-js";

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getAvailableAt } from 'src/modules/nftLend/utils';

export default class MakeOfferNearWithNativeTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    principal: number,
    rate: number,
    duration: number,
    availableIn: number,
  ): Promise<TransactionResult> {
    try {
      const gas = await this.calculateGasFee();
      const transactions = [];

      const amount = new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10)

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'offer',
        loan_principal_amount: amount,
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_at: getAvailableAt(availableIn),
      });

      transactions.push({
        receiverId: this.lendingProgram,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: "offer_by_near",
              args: {
                receiver_id: this.lendingProgram,
                amount,
                msg,
              },
              gas,
              deposit: amount,
            },
          }
        ]
      });

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
