import BigNumber from 'bignumber.js';
import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getNearConfig, NEAR_DEAULT_DEPOSIT_YOCTO, NEAR_DEFAULT_GAS, NEAR_DEFAULT_STORAGE_FEE } from '../utils';

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
      const account = window.nearAccount.account();
      const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
      const keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);
      const pawnContract = await window.near.loadContract(
        this.lendingProgram,
        {
          viewMethods: ['storage_minimum_balance'],
          changeMethods: ['storage_deposit'],
          sender: accountId,
        },
      );
      const requiredAmount = await pawnContract.storage_minimum_balance();
      console.log("🚀 ~ file: createLoan.ts ~ line 32 ~ CreateLoanNearTransaction ~ requiredAmount", requiredAmount)

      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: rate,
      });
      const nftContract = await window.near.loadContract(
        assetContractAddress,
        { viewMethods: [], changeMethods: ["nft_approve"], sender: accountId }
      );

      const actions = [
        nearAPI.transactions.addKey(
          keyPair.getPublicKey(),
          nearAPI.transactions.functionCallAccessKey(
            this.lendingProgram,
            ['storage-deposit'],
            requiredAmount
          )
        ),
        // pawnContract.storage_deposit(
        //   { account_id: accountId },
        //   NEAR_DEFAULT_GAS,
        //   requiredAmount
        // ),
        // nftContract.nft_approve(
        //   {
        //     token_id: assetTokenId,
        //     account_id: this.lendingProgram,
        //     msg,
        //   },
        //   NEAR_DEFAULT_GAS,
        //   NEAR_DEAULT_DEPOSIT_YOCTO,
        // ),
      ];
      const res = await account.signAndSendTransaction(accountId, actions)
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      console.log("🚀 ~ file: createLoan.ts ~ line 53 ~ CreateLoanNearTransaction ~ err", JSON.stringify(err))
      return this.handleError(err);
    }
  }
}
