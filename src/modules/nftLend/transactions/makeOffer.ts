import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import MakeOfferEvmTransaction from 'src/modules/evm/transactions/makeOffer';
import MakeOfferTransaction from 'src/modules/solana/transactions/makeOffer';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { MakeOfferParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface MakeOfferTxParams extends MakeOfferParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');

  const transaction = new MakeOfferTransaction(params.solana.connection, params.solana.wallet);
  const res = await transaction.run(
  params.currency_contract_address,
    currencyAssociated,
    params.loan_owner,
    params.loan_data_address,
    params.principal * 10 ** params.currency_decimal,
    params.rate * 10000,
    params.duration * 86400,
    Math.floor(Date.now() / 1000) + 7 * 86400,
  );
  return res;
}

const evmTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  const transaction = new MakeOfferEvmTransaction(params.chain);
  const res = await transaction.run(
    params.principal,
    params.asset_token_id,
    params.duration * 86400,
    params.rate,
    params.asset_contract_address,
    params.currency_contract_address,
    params.currency_decimal,
    params.lender,
    params.loan_id,
  );
  return res;
}

const makeOfferTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default makeOfferTx;