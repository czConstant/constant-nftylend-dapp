import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import { CancelLoanParams, CreateLoanParams, TransactionResult } from '../models/transaction';
import cancelLoanTx from '../transactions/cancelLoan';
import createLoanTx from '../transactions/createLoan';

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
      solanaOption: {
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
      solanaOption: {
        connection,
        wallet,
      }
    });
  };

  return { createLoan, cancelLoan };
};

export { useTransaction };