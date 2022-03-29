import { Chain } from 'src/common/constants/network';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getLinkPolygonExplorer, getPolygonLendingProgramId } from '../utils';

export default class EvmTransaction {
  lendingProgram;
  chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
    if (chain === Chain.Polygon) {
      this.lendingProgram = getPolygonLendingProgramId();
    } else {
      throw new Error(`Chain ${chain} is not supported`);
    }
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
          await api.post(`${API_URL.NFT_LEND.UPDATE_BLOCK_EVM.replace('{network}', this.chain)}/${res.blockNumber}`);
          break;
        } catch (err) { }
        await new Promise(r => setTimeout(r, 5000));
        count += 1;
      }
    }
    if (res.txHash) {
      let txExplorerUrl = `No explorer for chain ${this.chain}`;
      if (this.chain === Chain.Polygon) {
        txExplorerUrl = getLinkPolygonExplorer(res.txHash, 'tx');
      }
      return { ...res, txExplorerUrl };
    }
    return res;
  };
}
