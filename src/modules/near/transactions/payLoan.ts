import BigNumber from 'bignumber.js';
import * as nearAPI from 'near-api-js';

import NearTransaction from './index';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { APP_URL } from 'src/common/constants/url';

export default class PayLoanNearTransaction extends NearTransaction {
  async run(
    payAmount: number,
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
      const gas = await this.calculateGasFee();

      const msg = JSON.stringify({
        nft_contract_id: assetContractAddress,
        token_id: assetTokenId,
        action: 'pay_back_loan',
        loan_principal_amount: new BigNumber(principal).multipliedBy(10 ** currencyDecimals).toString(10),
        loan_duration: duration,
        loan_currency: currencyContractAddress,
        loan_interest_rate: new BigNumber(rate).multipliedBy(10000).toNumber(),
        available_in: 0,
      });

      const action = nearAPI.transactions.functionCall(
        'ft_transfer_call',
        Buffer.from(JSON.stringify({
          receiver_id: this.lendingProgram,
          amount: new BigNumber(payAmount).multipliedBy(10 ** currencyDecimals).toString(10),
          msg,
        })),
        gas,
        1
      );
      const transaction = await this.createTransaction([ action ], currencyContractAddress);
      await connection.requestSignTransactions({ 
        transactions: [transaction],
        callbackUrl: this.generateCallbackUrl({ token_id: assetTokenId, contract_address: assetContractAddress }, `${window.location.origin}${APP_URL.NFT_LENDING_MY_NFT}`),
      });

      return this.handleSuccess({ txHash: '' } as TransactionResult);
    } catch (err) {
      return this.handleError(err);
    }
  }
}
