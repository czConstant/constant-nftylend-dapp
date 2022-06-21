import BigNumber from 'bignumber.js';
import { timestampAfter } from '@nftpawn-js/core';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { nearViewFunction } from '../utils';

export default class MakeOfferNearTransaction extends NearTransaction {
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

      const storageBalance = await nearViewFunction(currencyContractAddress, 'storage_balance_of', { account_id: this.accountId });
      if (!storageBalance) {
        const bound = await nearViewFunction(currencyContractAddress, 'storage_balance_bounds');
        transactions.push({
          receiverId: currencyContractAddress,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "storage_deposit",
                args: { },
                gas,
                deposit: bound.min,
              },
            }
          ]
        });
      }

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'offer',
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_at: timestampAfter(availableIn),
      });

      transactions.push({
        receiverId: currencyContractAddress,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: "ft_transfer_call",
              args: {
                receiver_id: this.lendingProgram,
                amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
                msg,
              },
              gas,
              deposit: 1,
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
