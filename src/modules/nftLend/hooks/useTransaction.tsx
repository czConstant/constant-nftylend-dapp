import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AcceptOfferParams, CancelLoanParams, CancelOfferParams, CloseOfferParams, CreateLoanParams, LiquidateLoanParams, MakeOfferParams, OrderNowParams, PayLoanParams, TransactionResult } from '../models/transaction';
import acceptOfferTx from '../transactions/acceptOffer';
import cancelLoanTx from '../transactions/cancelLoan';
import cancelOfferTx from '../transactions/cancelOffer';
import closeOfferTx from '../transactions/closeOffer';
import createLoanTx from '../transactions/createLoan';
import liquidateLoanTx from '../transactions/liquidateLoan';
import makeOfferTx from '../transactions/makeOffer';
import orderNowTx from '../transactions/orderNow';
import payLoanTx from '../transactions/payLoan';
import { useCurrentWallet } from './useCurrentWallet';

function useTransaction() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { currentWallet } = useCurrentWallet();

  const addParams = {
    chain: currentWallet.chain,
    walletAddress: currentWallet.address,
    solana: {
      connection,
      wallet,
    }
  };

  const createLoan = async (params: CreateLoanParams): Promise<TransactionResult> => {
    return createLoanTx({
      ...params,
      ...addParams,
    })
  };

  const cancelLoan = async (params: CancelLoanParams): Promise<TransactionResult> => {
    return cancelLoanTx({
      ...params,
      ...addParams,
    });
  };

  const makeOffer = async (params: MakeOfferParams): Promise<TransactionResult> => {
    return makeOfferTx({
      ...params,
      ...addParams,
    });
  };

  const cancelOffer = async (params: CancelOfferParams): Promise<TransactionResult> => {
    return cancelOfferTx({
      ...params,
      ...addParams,
    });
  };

  const acceptOffer = async (params: AcceptOfferParams): Promise<TransactionResult> => {
    return acceptOfferTx({
      ...params,
      ...addParams,
    });
  };

  const orderNow = async (params: OrderNowParams): Promise<TransactionResult> => {
    return orderNowTx({
      ...params,
      ...addParams,
    });
  };

  const liquidateLoan = async (params: LiquidateLoanParams): Promise<TransactionResult> => {
    return liquidateLoanTx({
      ...params,
      ...addParams,
    });
  };

  const closeOffer = async (params: CloseOfferParams): Promise<TransactionResult> => {
    return closeOfferTx({
      ...params,
      ...addParams,
    });
  };

  const payLoan = async (params: PayLoanParams): Promise<TransactionResult> => {
    return payLoanTx({
      ...params,
      ...addParams,
    });
  };

  return { 
    createLoan,
    cancelLoan,
    makeOffer,
    cancelOffer,
    acceptOffer,
    orderNow,
    liquidateLoan,
    closeOffer,
    payLoan,
  };
};

export { useTransaction };