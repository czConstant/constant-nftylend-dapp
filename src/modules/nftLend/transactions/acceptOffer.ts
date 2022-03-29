import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import AcceptOfferEvmTransaction from 'src/modules/evm/transactions/acceptOffer';
import AcceptOfferTransaction from 'src/modules/solana/transactions/acceptOffer';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { AcceptOfferParams, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface AcceptOfferTxParams extends AcceptOfferParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: AcceptOfferTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');

  const transaction = new AcceptOfferTransaction(params.solana.connection, params.solana.wallet);
  const res = await transaction.run(
    params.currency_contract_address,
    currencyAssociated,
    params.loan_data_address,
    params.offer_data_address,
    params.currency_data_address,
    params.lender,
    params.principal * 10 ** params.currency_decimals,
    params.duration,
    params.rate * 10000,
  );
  return res;
}

const evmTx = async (params: AcceptOfferTxParams): Promise<TransactionResult> => {
  const transaction = new AcceptOfferEvmTransaction(params.chain);
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
    params.lender,
    params.lender_nonce,
    params.lender_signature,
  );
  return res;
}

const acceptOfferTx = async (params: AcceptOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default acceptOfferTx;