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
      const connection = new nearAPI.WalletConnection(window.near, null);
      const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();
      const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
      const keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);
      const pawnContract = new nearAPI.Contract(
        account,
        this.lendingProgram,
        {
          viewMethods: ['storage_minimum_balance'],
          changeMethods: ['storage_deposit'],
        },
      );
      const requiredAmount = await pawnContract.storage_minimum_balance();

      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: rate,
      });
      
      const nftContract = new nearAPI.Contract(
        account,
        assetContractAddress,
        { viewMethods: [], changeMethods: ["nft_approve"] }
      );
      console.log("🚀 ~ file: createLoan.ts ~ line 50 ~ CreateLoanNearTransaction ~ this.lendingProgram", this.lendingProgram)
      // await nftContract.nft_approve(
      //   {
      //     token_id: assetTokenId,
      //     account_id: this.lendingProgram,
      //     msg,
      //   },
      //   NEAR_DEFAULT_GAS,
      //   NEAR_DEAULT_DEPOSIT_YOCTO,
      // );
      
      const transactions = [
        nearAPI.transactions.addKey(
          keyPair.getPublicKey(),
          nearAPI.transactions.functionCallAccessKey(
            this.lendingProgram,
            ['storage_deposit'],
            requiredAmount
          )
        ),
        account.functionCall({
          contractId: this.lendingProgram,
          methodName: 'storage_deposit',
          args: { account_id: accountId },
          gas: NEAR_DEFAULT_GAS,
          attachedDeposit: requiredAmount,
        }),
        account.functionCall({
          contractId: assetContractAddress,
          methodName: 'nft_approve',
          args: {
            token_id: assetTokenId,
            account_id: this.lendingProgram,
            msg,
          },
          gas: NEAR_DEFAULT_GAS,
          attachedDeposit: requiredAmount,
        }),
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
      const res = await connection.requestSignTransactions({ transactions })
      console.log("🚀 ~ file: createLoan.ts ~ line 75 ~ CreateLoanNearTransaction ~ res", res)
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      console.log("🚀 ~ file: createLoan.ts ~ line 53 ~ CreateLoanNearTransaction ~ err", JSON.stringify(err))
      return this.handleError(err);
    }
  }
}
