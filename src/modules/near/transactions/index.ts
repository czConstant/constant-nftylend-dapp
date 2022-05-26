import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import store from 'src/store';
import localStore from 'src/common/services/localStore';
import { getLinkNearExplorer, getNearConfig, NEAR_DEFAULT_GAS } from '../utils';

export default class NearTransaction {
  lendingProgram;
  accountId;

  constructor() {
    this.lendingProgram = store.getState().nftyLend.configs.near_nftypawn_address;
    this.accountId = localStore.get(localStore.KEY_WALLET_ADDRESS);
  }

  calculateGasFee = async (): Promise<string | null> => {
    return NEAR_DEFAULT_GAS;
  }

  // createTransaction = async (actions: Array<nearAPI.transactions.Action>, receiverId: string): Promise<nearAPI.transactions.Transaction> => {
  //   const account: nearAPI.ConnectedWalletAccount = window.nearAccount.account();
  //   const accountId = window.nearAccount.getAccountId();
  //   const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  //   const keyPair = await keyStore.getKey(getNearConfig().networkId, accountId);
    
  //   const block = await account.connection.provider.block({ finality: 'final' });
  //   const blockHash =  baseDecode(block.header.hash);

  //   let accessKey = await account.accessKeyForTransaction(accountId, actions, keyPair.getPublicKey());
  //   const nonce = accessKey.access_key.nonce + 1;
  //   return nearAPI.transactions.createTransaction(
  //     accountId,
  //     keyPair.getPublicKey(),
  //     receiverId,
  //     nonce,
  //     actions,
  //     blockHash,
  //   );
  // }

  saveStateBeforeRedirect = ({ contract_address, token_id }) => {
    // localStore.save(localStore.KEY_NEAR_NFT_CONTRACT, contract_address);
    // localStore.save(localStore.KEY_NEAT_NFT_TOKEN_ID, token_id);
  }

  generateCallbackUrl = (query: any, customUrl?: string): string => {
    let url = new URL(customUrl || `${window.location.origin}${window.location.pathname}`);
    Object.keys(query).forEach(k => url.searchParams.set(k, query[k]));
    return url.toString();
  }

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult, assetContractAddress?: string, assetTokenId?: string): Promise<TransactionResult> => {
    if (assetContractAddress && assetTokenId) {
      let count = 0;
      while (count < 6) {
        try {
          const res = await api.post(API_URL.NFT_LEND.SYNC_NEAR, { token_id: assetTokenId, contract_address: assetContractAddress });
          if (res.result) {
            break;
          }
        } catch (err) { }
        await new Promise(r => setTimeout(r, 5000));
        count += 1;
      }
      localStore.remove(localStore.KEY_NEAR_NFT_CONTRACT);
      localStore.remove(localStore.KEY_NEAT_NFT_TOKEN_ID);
    }
    if (res.txHash) {
      const txExplorerUrl = getLinkNearExplorer(res.txHash, 'tx');
      return { ...res, txExplorerUrl, completed: true };
    }
    return { ...res, completed: true };
  };
}
