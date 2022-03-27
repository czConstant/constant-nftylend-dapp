import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import OrderNowTransaction from 'src/modules/solana/transactions/orderNow';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { OrderOfferParams, TransactionResult } from '../models/transaction';

interface OrderOfferTxParams extends OrderOfferParams {
  chain: Chain;
  walletAddress: string;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: OrderOfferTxParams): Promise<TransactionResult> => {
  if (!params.solana?.connection || !params.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const borrowerAssociated = await getAssociatedAccount(params.loan_owner, params.currency_contract_address);
  if (!borrowerAssociated) throw new Error('No borrower associated account for currency');
  
  const lenderAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!lenderAssociated) throw new Error('No lender associated account for currency');

  const transaction = new OrderNowTransaction(params.solana.connection, params.solana.wallet);
  const res = await transaction.run(
    params.currency_contract_address,
    params.loan_data_address,
    params.principal * 10 ** params.currency_decimal,
    borrowerAssociated,
    params.loan_owner,
    lenderAssociated,
  );
  return res;
}

const polygonTx = async (params: OrderOfferTxParams): Promise<TransactionResult> => {
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

const orderOfferTx = async (params: OrderOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (params.chain === Chain.Polygon) {
    return polygonTx(params);
  }
  throw new Error('Chain not supported');
};

export default orderOfferTx;