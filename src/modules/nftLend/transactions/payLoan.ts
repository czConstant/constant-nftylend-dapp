import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Chain } from 'src/common/constants/network';
import PayLoanEvmTransaction from 'src/modules/evm/transactions/payLoan';
import PayLoanNearTransaction from 'src/modules/near/transactions/payLoan';
import PayLoanTransaction from 'src/modules/solana/transactions/payLoan';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { PayLoanParams, TransactionOptions, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface PayLoanTxParams extends PayLoanParams {
  chain: Chain;
  walletAddress: string;
  options?: TransactionOptions;
  solana?: {
    connection: Connection;
    wallet: WalletContextState;
  }
}

const solTx = async (params: PayLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.solana?.connection || !params.options?.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const nftAssociated = await getAssociatedAccount(params.walletAddress, params.asset_contract_address);
  if (!nftAssociated) throw new Error('No associated account for asset');

  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');
  
  const transaction = new PayLoanTransaction(
    params.options.solana.connection,
    params.options.solana.wallet,
  );
  const res = await transaction.run(
    params.pay_amount * 10 ** params.currency_decimal,
    params.loan_data_address,
    params.offer_data_address,
    nftAssociated,
    currencyAssociated,
    params.walletAddress,
    params.currency_data_address,
    params.asset_data_address,
    params.admin_fee_address,
  );
  return res;
}

const evmTx = async (params: PayLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.evm?.provider) throw new Error('No ethereum provider');

  const transaction = new PayLoanEvmTransaction(
    params.chain,
    params.options.evm.provider,
  );
  const res = await transaction.run(
    params.loan_data_address,
    params.walletAddress,
    params.pay_amount,
    params.currency_contract_address,
    params.currency_decimal,
  );
  return res;
}

const nearTx = async (params: PayLoanTxParams): Promise<TransactionResult> => {
  const transaction = new PayLoanNearTransaction();
  const res = await transaction.run(
    params.asset_token_id,
    params.asset_contract_address,
    params.currency_contract_address,
    params.currency_decimal,
    params.principal,
    params.rate,
    params.duration,
  );
  return res;
}

const payLoanTx = async (params: PayLoanTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } if (params.chain === Chain.Near) {
    return nearTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default payLoanTx;