import { Chain } from 'src/common/constants/network';
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
