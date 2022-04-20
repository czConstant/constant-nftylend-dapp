import * as nearApi from 'near-api-js';
import { Chain } from 'src/common/constants/network';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import store from 'src/store';
import { getLinkNearExplorer, NEAR_DEFAULT_GAS } from '../utils';

export default class NearTransaction {
  lendingProgram;

  constructor() {
    this.lendingProgram = store.getState().nftyLend.configs.near_nftypawn_address;
  }

  checkNeedDepositStorage = async (contractAddress: string, autoDeposit: boolean = false): Promise<boolean> => {
    const accountId = window.nearAccount.getAccountId();
    const contract = await window.near.loadContract(
      contractAddress,
      {
        viewMethods: ['storage_amount', 'storage_balance_of'],
        changeMethods: ['storage_deposit'],
        sender: accountId,
      },
    );
    const requiredAmount = await contract.storage_amount();
    const balance = await contract.storage_balance_of({ account_id: accountId });

    if (autoDeposit) {
      const account = await window.near.account(accountId);
      console.log('b')
      await contract.storage_deposit({
        account_id: accountId,
      }, NEAR_DEFAULT_GAS, requiredAmount);
      console.log('c')
    }

    return requiredAmount > balance;
  }

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult): Promise<TransactionResult> => {
    if (res.blockNumber) {
      let count = 0;
      while (count < 6) {
        try {
          await api.post(`${API_URL.NFT_LEND.UPDATE_BLOCK_EVM.replace('{network}', Chain.Near)}/${res.blockNumber}`);
          break;
        } catch (err) { }
        await new Promise(r => setTimeout(r, 5000));
        count += 1;
      }
    }
    if (res.txHash) {
      const txExplorerUrl = getLinkNearExplorer(res.txHash, 'tx');
      return { ...res, txExplorerUrl };
    }
    return res;
  };
}
