import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import withWalletProvider from 'src/modules/solana/hooks/withWalletProvider';
import CreateLoanTransaction from 'src/modules/solana/transactions/createLoan';
import { CreateLoanParams, TransactionResult } from '../models/transaction';

function useTransaction() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const createLoan = async (params: CreateLoanParams): Promise<TransactionResult> => {
    const transaction = new CreateLoanTransaction(connection, wallet);
    const res = await transaction.run(
      params.asset_contract_address,
      params.options.nftAssociated,
      params.options.receiveTokenMint,
      params.options.receiveTokenAssociated,
      {
        principal: params.principal * 10 ** params.options.currencyDecimals,
        rate: params.rate * 100,
        duration: params.duration * 86400,
      }
    );
    return { txHash: res.txHash };
  };

  return { createLoan };
};

export { useTransaction };