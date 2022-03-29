import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import CancelLoanEvmTransaction from 'src/modules/evm/transactions/cancelLoan';
import CancelLoanTransaction from 'src/modules/solana/transactions/cancelLoan';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { CancelLoanParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface CancelLoanTxParams extends CancelLoanParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: CancelLoanTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const nftAssociated = await getAssociatedAccount(params.walletAddress, params.asset_contract_address);
  if (!nftAssociated) throw new Error('No associated account for asset');
  
  const transaction = new CancelLoanTransaction(params.solana?.connection, params.solana?.wallet);
  const res = await transaction.run(
    nftAssociated,
    params.loan_data_address,
    params.asset_contract_address
  );
  return res;
}

const evmTx = async (params: CancelLoanTxParams): Promise<TransactionResult> => {
  const transaction = new CancelLoanEvmTransaction(params.chain);
  const res = await transaction.run(params.nonce);
  return res;
}

const cancelLoanTx = async (params: CancelLoanTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default cancelLoanTx;