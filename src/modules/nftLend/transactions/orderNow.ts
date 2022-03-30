import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import OrderNowEvmTransaction from 'src/modules/evm/transactions/orderNow';
import OrderNowTransaction from 'src/modules/solana/transactions/orderNow';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { OrderNowParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface OrderNowTxParams extends OrderNowParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: OrderNowTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const borrowerAssociated = await getAssociatedAccount(params.borrower, params.currency_contract_address);
  if (!borrowerAssociated) throw new Error('No borrower associated account for currency');
  
  const lenderAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!lenderAssociated) throw new Error('No lender associated account for currency');

  const transaction = new OrderNowTransaction(params.solana.connection, params.solana.wallet);
  const res = await transaction.run(
    params.currency_contract_address,
    params.loan_data_address,
    params.principal * 10 ** params.currency_decimals,
    borrowerAssociated,
    params.borrower,
    lenderAssociated,
  );
  return res;
}

const evmTx = async (params: OrderNowTxParams): Promise<TransactionResult> => {
  const transaction = new OrderNowEvmTransaction(params.chain);
  const res = await transaction.run(
    params.principal,
    params.asset_token_id,
    params.duration,
    params.rate,
    params.asset_contract_address,
    params.currency_contract_address,
    params.currency_decimals,
    params.borrower,
    params.borrower_nonce,
    params.borrower_signature,
    params.walletAddress,
  );
  return res;
}

const orderNowTx = async (params: OrderNowTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params);
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default orderNowTx;