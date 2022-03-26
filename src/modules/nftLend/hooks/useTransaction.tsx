import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import { CancelLoanParams, CancelOfferParams, CreateLoanParams, MakeOfferParams, TransactionResult } from '../models/transaction';
import cancelLoanTx from '../transactions/cancelLoan';
import cancelOfferTx from '../transactions/cancelOffer';
import createLoanTx from '../transactions/createLoan';
import makeOfferTx from '../transactions/makeOffer';

function useTransaction() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const createLoan = async (params: CreateLoanParams): Promise<TransactionResult> => {
    return createLoanTx({
      ...params,
      chain: walletChain,
      walletAddress,
      solana: {
        connection,
        wallet,
      }
    })
  };

  const cancelLoan = async (params: CancelLoanParams): Promise<TransactionResult> => {
    return cancelLoanTx({
      ...params,
      chain: walletChain,
      walletAddress,
      solana: {
        connection,
        wallet,
      }
    });
  };

  const makeOffer = async (params: MakeOfferParams): Promise<TransactionResult> => {
    return makeOfferTx({
      ...params,
      chain: walletChain,
      walletAddress,
      solana: {
        connection,
        wallet,
      }
    });
  };

  const cancelOffer = async (params: CancelOfferParams): Promise<TransactionResult> => {
    return cancelOfferTx({
      ...params,
      chain: walletChain,
      walletAddress,
      solana: {
        connection,
        wallet,
      }
    });
  };

  return { createLoan, cancelLoan, makeOffer, cancelOffer };
};

export { useTransaction };