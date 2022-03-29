import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import LiquidateLoanEvmTransaction from 'src/modules/evm/transactions/liquidateLoan';
import LiquidateLoanTransaction from 'src/modules/solana/transactions/liquidateLoan';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { LiquidateLoanParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface LiquidateLoanTxParams extends LiquidateLoanParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const nftAssociated = await getAssociatedAccount(params.walletAddress, params.asset_contract_address);
  if (!nftAssociated) throw new Error('No associated account for asset');
  
  const transaction = new LiquidateLoanTransaction(params.solana?.connection, params.solana?.wallet);
  const res = await transaction.run(
    params.asset_contract_address,
    params.loan_owner,
    params.loan_data_address,
    params.offer_data_address,
    params.currency_data_address,
    params.asset_data_address,
  );
  return res;
}

const evmTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  const transaction = new LiquidateLoanEvmTransaction(params.chain);
  const res = await transaction.run(params.loan_data_address);
  return res;
}

const liquidateLoanTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default liquidateLoanTx;