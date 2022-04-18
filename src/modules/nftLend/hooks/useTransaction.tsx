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

  const getBlockChainParams = () => {
    return {
      chain: currentWallet.chain,
      walletAddress: currentWallet.address,
      options: {
        solana: {
          connection,
          wallet,
        },
        evm: {
          provider: window.evmProvider,
        }
      }
    };
  }

  const createLoan = async (params: CreateLoanParams): Promise<TransactionResult> => {
    return createLoanTx({
      ...params,
      ...getBlockChainParams(),
    })
  };

  const cancelLoan = async (params: CancelLoanParams): Promise<TransactionResult> => {
    return cancelLoanTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const makeOffer = async (params: MakeOfferParams): Promise<TransactionResult> => {
    return makeOfferTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const cancelOffer = async (params: CancelOfferParams): Promise<TransactionResult> => {
    return cancelOfferTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const acceptOffer = async (params: AcceptOfferParams): Promise<TransactionResult> => {
    return acceptOfferTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const orderNow = async (params: OrderNowParams): Promise<TransactionResult> => {
    return orderNowTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const liquidateLoan = async (params: LiquidateLoanParams): Promise<TransactionResult> => {
    return liquidateLoanTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const closeOffer = async (params: CloseOfferParams): Promise<TransactionResult> => {
    return closeOfferTx({
      ...params,
      ...getBlockChainParams(),
    });
  };

  const payLoan = async (params: PayLoanParams): Promise<TransactionResult> => {
    return payLoanTx({
      ...params,
      ...getBlockChainParams(),
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