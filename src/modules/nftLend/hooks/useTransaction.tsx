import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import { AcceptOfferParams, CancelLoanParams, CancelOfferParams, CloseOfferParams, CreateLoanParams, LiquidateLoanParams, MakeOfferParams, OrderOfferParams, PayLoanParams, TransactionResult } from '../models/transaction';
import acceptOfferTx from '../transactions/acceptOffer';
import cancelLoanTx from '../transactions/cancelLoan';
import cancelOfferTx from '../transactions/cancelOffer';
import closeOfferTx from '../transactions/closeOffer';
import createLoanTx from '../transactions/createLoan';
import liquidateLoanTx from '../transactions/liquidateLoan';
import makeOfferTx from '../transactions/makeOffer';
import orderOfferTx from '../transactions/orderOffer';
import payLoanTx from '../transactions/payLoan';

function useTransaction() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const addParams = {
    chain: walletChain,
    walletAddress,
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

  const orderOffer = async (params: OrderOfferParams): Promise<TransactionResult> => {
    return orderOfferTx({
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
    orderOffer,
    liquidateLoan,
    closeOffer,
    payLoan,
  };
};

export { useTransaction };