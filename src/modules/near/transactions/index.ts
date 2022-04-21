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

  calculateGasFee = async (): Promise<string | null> => {
    return NEAR_DEFAULT_GAS;
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
