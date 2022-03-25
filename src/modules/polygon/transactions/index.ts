import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getLinkPolygonExplorer } from '../utils';

export default class EvmTransaction {
  constructor() {
  
  }

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult): Promise<TransactionResult> => {
    const txExplorerUrl = res.txHash ? getLinkPolygonExplorer(res.txHash) : '';
    return { ...res, txExplorerUrl };
  };
}
