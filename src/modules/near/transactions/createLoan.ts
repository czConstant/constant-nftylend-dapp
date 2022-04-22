import BigNumber from 'bignumber.js';
import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getNearConfig } from '../utils';

export default class CreateLoanNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    principal: number,
    rate: number,
    duration: number,
    currencyContractAddress: string,
    currencyDecimals: number,
  ): Promise<TransactionResult> {
    try {
      const accountId = window.nearAccount.getAccountId();
      const connection = new nearAPI.WalletConnection(window.near, null);
      const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();
      const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
      const keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);
      const pawnContract = new nearAPI.Contract(
        account,
        this.lendingProgram,
        {
          viewMethods: ['storage_minimum_balance', 'storage_minimum_balance'],
          changeMethods: ['storage_deposit'],
        },
      );
      const requiredAmount = await pawnContract.storage_minimum_balance();
      const storageBalance = await pawnContract.storage_balance_of({ account_id: accountId });

      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: rate * 10000,
      });

      const gas = await this.calculateGasFee();
      if (requiredAmount > storageBalance) {
        await account.functionCall({
          contractId: this.lendingProgram,
          methodName: 'storage_deposit',
          args: { account_id: accountId },
          gas,
          attachedDeposit: requiredAmount,
        });
      } else {
        await account.functionCall({
          contractId: assetContractAddress,
          methodName: 'nft_approve',
          args: {
            token_id: assetTokenId,
            account_id: this.lendingProgram,
            msg,
          },
          gas,
          attachedDeposit: requiredAmount,
        });
      }
      // const transactions =  [
      //   account.functionCall({
      //     contractId: this.lendingProgram,
      //     methodName: 'storage_deposit',
      //     args: { account_id: accountId },
      //     gas,
      //     attachedDeposit: requiredAmount,
      //   }),
      //   account.functionCall({
      //     contractId: assetContractAddress,
      //     methodName: 'nft_approve',
      //     args: {
      //       token_id: assetTokenId,
      //       account_id: this.lendingProgram,
      //       msg,
      //     },
      //     gas,
      //     attachedDeposit: requiredAmount,
      //   }),
      // ];
      // await connection.requestSignTransactions({ transactions })
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
