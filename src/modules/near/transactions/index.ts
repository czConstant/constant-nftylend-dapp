import * as nearAPI from 'near-api-js';
import { baseDecode } from 'borsh';

import { Chain } from 'src/common/constants/network';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import store from 'src/store';
import { getLinkNearExplorer, getNearConfig, NEAR_DEFAULT_GAS } from '../utils';

export default class NearTransaction {
  lendingProgram;

  constructor() {
    this.lendingProgram = store.getState().nftyLend.configs.near_nftypawn_address;
  }

  calculateGasFee = async (): Promise<string | null> => {
    return NEAR_DEFAULT_GAS;
  }

  createTransaction = async (actions: Array<nearAPI.transactions.Action>, receiverId: string): Promise<nearAPI.transactions.Transaction> => {
    const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();
    const accountId = window.nearAccount.getAccountId();
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);
    
    const block = await account.connection.provider.block({ finality: 'final' });
    const blockHash =  baseDecode(block.header.hash);

    let accessKey = await account.accessKeyForTransaction(accountId, actions, keyPair.getPublicKey());
    const nonce = accessKey.access_key.nonce + 1;
    return nearAPI.transactions.createTransaction(
      accountId,
      keyPair.getPublicKey(),
      receiverId,
      nonce,
      actions,
      blockHash,
    );
  }

  generateCallbackUrl = (query: any): string => {
    let url = new URL(`${window.location.origin}${window.location.pathname}`);
    Object.keys(query).forEach(k => url.searchParams.set(k, query[k]));
    return url.toString();
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
      return { ...res, txExplorerUrl, completed: false };
    }
    return { ...res, completed: false };
  };
}
