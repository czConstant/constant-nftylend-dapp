import BigNumber from 'bignumber.js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getAvailableAt } from 'src/modules/nftLend/utils';
import { nearViewFunction, NEAR_LOAN_STATUS } from '../utils';
import api from 'src/common/services/apiClient';
import { API_URL } from 'src/common/constants/url';

export default class CreateLoanNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    principal: number,
    rate: number,
    duration: number,
    currencyContractAddress: string,
    currencyDecimals: number,
    availableIn: number,
    loanConfig: number,
  ): Promise<TransactionResult> {
    try {
      const existed = await nearViewFunction(
        this.lendingProgram,
        'get_sale',
        { nft_contract_token: `${assetContractAddress}||${assetTokenId}` },
      );
      if (existed  && [NEAR_LOAN_STATUS.Open, NEAR_LOAN_STATUS.Processing].includes(existed.status)) {
        // Request api to sync the asset
        api.post(API_URL.NFT_LEND.SYNC_NEAR, { token_id: assetTokenId, contract_address: assetContractAddress });
        throw new Error('This asset is in a processing loan');
      }
      const requiredAmount = await nearViewFunction(this.lendingProgram, 'storage_minimum_balance');
      
      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_config: loanConfig,
        available_at: getAvailableAt(availableIn),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
      });

      const gas = await this.calculateGasFee();
      const transactions = [
        {
          receiverId: this.lendingProgram,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "storage_deposit",
                args: { account_id: this.accountId },
                gas,
                deposit: requiredAmount,
              },
            }
          ]
        },
        {
          receiverId: assetContractAddress,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: "nft_approve",
                args: { token_id: assetTokenId, account_id: this.lendingProgram, msg },
                gas,
                deposit: requiredAmount,
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
