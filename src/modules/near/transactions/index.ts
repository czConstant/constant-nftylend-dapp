import * as nearAPI from 'near-api-js';
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

  // checkNeedDepositStorage = async (contractAddress: string, autoDeposit: boolean = false): Promise<boolean> => {
  //   console.log("🚀 ~ file: index.ts ~ line 17 ~ NearTransaction ~ checkNeedDepositStorage= ~ contractAddress", contractAddress)
  //   const accountId = window.nearAccount.getAccountId();
  //   const contract = await window.near.loadContract(
  //     contractAddress,
  //     {
  //       viewMethods: ['storage_minimum_balance', 'storage_balance_of'],
  //       changeMethods: ['storage_deposit'],
  //       sender: accountId,
  //     },
  //   );
  //   const requiredAmount = await contract.storage_minimum_balance();
  //   console.log("🚀 ~ file: index.ts ~ line 27 ~ NearTransaction ~ checkNeedDepositStorage= ~ requiredAmount", requiredAmount)
  //   const balance = await contract.storage_balance_of({ account_id: accountId });
  //   console.log("🚀 ~ file: index.ts ~ line 29 ~ NearTransaction ~ checkNeedDepositStorage= ~ balance", balance)

  //   if (requiredAmount > balance && autoDeposit) {
  //     const account = window.nearAccount.account();
  //     const depositAction = contract.storage_deposit({
  //       account_id: accountId,
  //     }, NEAR_DEFAULT_GAS, requiredAmount);

  //     const accessKey = await account.accessKeyForTransaction(contractAddress, [depositAction])
  //     console.log("🚀 ~ file: index.ts ~ line 39 ~ NearTransaction ~ checkNeedDepositStorage= ~ accessKey", accessKey)
  //     // if (!accessKey) {
  //     //   const keyPair = nearAPI.KeyPair.fromRandom('ed25519');
  //     //   const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  //     //   await keyStore.setKey(getNearConfig().networkId, accountId, keyPair);
  //     //   await account.addKey(
  //     //     keyPair.getPublicKey(),
  //     //     contractAddress,
  //     //     ['storage_deposit'],
  //     //     NEAR_DEFAULT_ALLOWANCE,
  //     //   );
  //     // }
  //     console.log('0')
  //     await depositAction;
  //     console.log('1')
  //   }

  //   return requiredAmount > balance;
  // }

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
