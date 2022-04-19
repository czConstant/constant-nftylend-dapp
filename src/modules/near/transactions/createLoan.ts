import BigNumber from 'bignumber.js';
import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { NEAR_DEFAULT_GAS } from '../utils';

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
      // const accountId = window.nearWallet.connection.getAccountId();
      // const pawnContract = new nearAPI.Contract(
      //   window.nearWallet.account,
      //   this.lendingProgram,
      //   {
      //     viewMethods: [""], 
      //     changeMethods: ["storage_deposit"],
      //   }
      // );
      // const res = await contract.storage_deposit({
      //   accountId: accountId,
      //   deposit: 1,
      // });
      const nftContract = await window.near.loadContract(
        assetContractAddress,
        { viewMethods: [], changeMethods: ["nft_approve"], sender: window.nearAccount.getAccountId() }
      );
      const msg = JSON.stringify({
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: rate,
      });
      const res = await nftContract.nft_approve({
        token_id: assetTokenId,
        account_id: this.lendingProgram,
        msg,
      }, NEAR_DEFAULT_GAS, 1000);
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
