import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import MakeOfferTransaction from 'src/modules/solana/transactions/makeOffer';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { MakeOfferParams, TransactionResult } from '../models/transaction';

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
    params.data_loan_address,
    params.principal * 10 ** params.currency_decimal,
    params.rate * 100,
    params.duration * 86400,
    Math.floor(Date.now() / 1000) + 7 * 86400,
  );
  return res;
}

const polygonTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
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

const makeOfferTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (params.chain === Chain.Polygon) {
    return polygonTx(params);
  }
  throw new Error('Chain not supported');
};

export default makeOfferTx;