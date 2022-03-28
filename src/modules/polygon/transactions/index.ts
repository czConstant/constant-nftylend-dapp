import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getLinkPolygonExplorer, getPolygonLendingProgramId } from '../utils';

export default class EvmTransaction {
  lendingProgram;

  constructor() {
    this.lendingProgram = getPolygonLendingProgramId();
  }

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult): Promise<TransactionResult> => {
    const txExplorerUrl = res.txHash ? getLinkPolygonExplorer(res.txHash, 'tx') : '';
    return { ...res, txExplorerUrl };
  };
}
