import BigNumber from 'bignumber.js';
import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';

export default class OrderNowNearTransaction extends NearTransaction {
  async run(
    assetTokenId: string,
    assetContractAddress: string,
    currencyContractAddress: string,
    currencyDecimals: number,
    principal: number,
    rate: number,
    duration: number,
  ): Promise<TransactionResult> {
    try {
      const connection = new nearAPI.WalletConnection(window.near, null);
      const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'offer_now',
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: rate * 10000,
      });
      
      const gas = await this.calculateGasFee();
      const transactions = [
        account.functionCall({
          contractId: currencyContractAddress,
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: this.lendingProgram,
            amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
            msg,
          },
          gas,
          attachedDeposit: 1,
        }),
      ];
      await connection.requestSignTransactions({ transactions })
      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
