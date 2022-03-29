import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import CancelOfferEvmTransaction from 'src/modules/evm/transactions/cancelOffer';
import CancelOfferTransaction from 'src/modules/solana/transactions/cancelOffer';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { CancelOfferParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface CancelOfferTxParams extends CancelOfferParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: CancelOfferTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');

  const transaction = new CancelOfferTransaction(params.solana.connection, params.solana.wallet);
  const res = await transaction.run(
    currencyAssociated,
    params.offer_data_address,
    params.currency_data_address
  );
  return res;
}

const evmTx = async (params: CancelOfferTxParams): Promise<TransactionResult> => {
  const transaction = new CancelOfferEvmTransaction(params.chain);
  const res = await transaction.run(params.nonce);
  return res;
}

const cancelOfferTx = async (params: CancelOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default cancelOfferTx;