import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import CloseOfferTransaction from 'src/modules/solana/transactions/closeOffer';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { CloseOfferParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface CloseOfferTxParams extends CloseOfferParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: CloseOfferTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');

  const transaction = new CloseOfferTransaction(params.solana.connection, params.solana.wallet);
  const res = await transaction.run(
    currencyAssociated,
    params.offer_data_address,
    params.currency_data_address
  );
  return res;
}

const evmTx = async (params: CloseOfferTxParams): Promise<TransactionResult> => {
  // const transaction = new CreateLoanEvmTransaction();
  // const res = await transaction.run(
  //   String(params.asset_token_id),
  //   params.asset_contract_address,
  //   params.walletAddress,
  //   {
  //     principal: params.principal,
  //     rate: params.rate / 100,
  //     duration: params.duration * 86400,
  //     currency_id: params.currency_id,
  //   }
  // );
  // return res;
}

const closeOfferTx = async (params: CloseOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default closeOfferTx;