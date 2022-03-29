import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { API_URL } from 'src/common/constants/url';
import api from 'src/common/services/apiClient';
import { TransactionResult } from 'src/modules/nftLend/models/transaction';
import { getLinkSolScanTx, getSolanaLendingProgramId } from '../utils';

export default class SolTransaction {
  wallet: WalletContextState;
  connection: Connection;
  lendingProgram: string;

  constructor(connection: Connection, wallet: WalletContextState) {
    this.connection = connection;
    this.wallet = wallet;
    this.lendingProgram = getSolanaLendingProgramId();
  }

  prepareRun = async() => {
    if (!this.wallet.publicKey) throw new Error('No public key');
  };

  handleError = async (err: any): Promise<TransactionResult> => {
    if (err?.name === 'WalletSignTransactionError') return {} as TransactionResult;
    throw err;
  };

  handleSuccess = async (res: TransactionResult): Promise<TransactionResult> => {
    let count = 0;
    let txDetail = null;
    let block = null;
    while (count < 10) {
      txDetail = await this.connection.getTransaction(res?.txHash);
      if (txDetail) {
        block = await this.connection.getBlock(txDetail?.slot);
        if (block) break;
      }
      await new Promise(r => setTimeout(r, 2000));
      count += 1;
    }
    count = 0;
    while (count < 6) {
      try {
        await api.post(`${API_URL.NFT_LEND.UPDATE_BLOCK_SOL}/${txDetail?.slot}`);
        break;
      } catch (err) { }
      await new Promise(r => setTimeout(r, 5000));
      count += 1;
    }
    const txExplorerUrl = getLinkSolScanTx(res.txHash);
    return {...res, txExplorerUrl };
  };
}
