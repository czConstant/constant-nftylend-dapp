import BigNumber from 'bignumber.js';
import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getAvailableAt } from 'src/modules/nftLend/utils';

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
      const accountId = window.nearAccount.getAccountId();
      const connection = new nearAPI.WalletConnection(window.near, null);
      const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();
      const pawnContract = new nearAPI.Contract(
        account,
        this.lendingProgram,
        {
          viewMethods: ['storage_minimum_balance', 'storage_balance_of'],
          changeMethods: ['storage_deposit'],
        },
      );
      const requiredAmount = await pawnContract.storage_minimum_balance();

      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_config: loanConfig,
        available_at: getAvailableAt(availableIn),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
      });

      const gas = await this.calculateGasFee();
      const transactions = [];

      // Deposit storage fee
      const actionStorageDeposit = nearAPI.transactions.functionCall(
        'storage_deposit',
        Buffer.from(JSON.stringify({ account_id: accountId })),
        gas,
        requiredAmount
      );
      const txStorageDeposit = await this.createTransaction([actionStorageDeposit], this.lendingProgram);
      transactions.push(txStorageDeposit)

      // Approve for transfer NFT
      const actionNftApprove = nearAPI.transactions.functionCall(
        'nft_approve',
        Buffer.from(JSON.stringify({ token_id: assetTokenId, account_id: this.lendingProgram, msg })),
        gas,
        requiredAmount
      );
      const txNftApprove = await this.createTransaction([ actionNftApprove ], assetContractAddress);
      transactions.push(txNftApprove);

      await connection.requestSignTransactions({ 
        transactions,
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }),
      });
      return this.handleSuccess({ } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
