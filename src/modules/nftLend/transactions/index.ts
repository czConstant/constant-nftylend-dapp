import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import axios from 'axios';
import { API_URL } from 'src/common/constants/url';
import store from 'src/store';

interface TransactionRes {
  txHash: string;
}

export default class SolTransaction {
  wallet: WalletContextState;
  connection: Connection;

  constructor(connection: Connection, wallet: WalletContextState) {
    this.connection = connection;
    this.wallet = wallet;
  }

  handleError = async (err: Error) => {
    if (err?.name === 'WalletSignTransactionError') return;
    // store.dispatch(showAlert({ message: err.message, type: 'danger' }));
  };

  handleSuccess = async (res: TransactionRes) => {
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
        await axios.post(`${API_URL.NFT_LEND.UPDATE_BLOCK}/${txDetail?.slot}`);
        break;
      } catch (err) { }
      await new Promise(r => setTimeout(r, 5000));
      count += 1;
    }
    return res;
  };
}
