import { Chain } from 'src/common/constants/network';
import CreateLoanEvmTransaction from 'src/modules/evm/transactions/createLoan';
import CreateLoanSolTransaction from 'src/modules/solana/transactions/createLoan';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { CreateLoanParams, TransactionOptions, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface CreateLoanTxParams extends CreateLoanParams {
  chain: Chain;
  walletAddress: string;
  options?: TransactionOptions;
}

export interface CreateLoanInfo {
  currency_id: number;
  principal: number;
  rate: number;
  duration: number; // days
}

const solTx = async (params: CreateLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.solana?.connection || !params.options?.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const nftAssociated = await getAssociatedAccount(params.walletAddress, params.asset_contract_address);
  if (!nftAssociated) throw new Error('No associated account for asset');
  
  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');

  const transaction = new CreateLoanSolTransaction(
    params.options.solana.connection,
    params.options.solana?.wallet,
  );
  const res = await transaction.run(
    params.asset_contract_address,
    nftAssociated,
    params.currency_contract_address,
    currencyAssociated,
    {
      principal: params.principal * 10 ** params.currency_decimal,
      rate: params.rate * 10000,
      duration: params.duration * 86400,
    }
  );
  return res;
}

const evmTx = async (params: CreateLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.evm?.provider) throw new Error('No ethereum provider');

  const transaction = new CreateLoanEvmTransaction(
    params.chain,
    params.options.evm.provider,
  );
  const res = await transaction.run(
    params.asset_token_id,
    params.asset_contract_address,
    params.walletAddress,
    params.principal,
    params.rate,
    params.duration * 86400,
    params.currency_id,
    params.currency_contract_address,
    params.currency_decimal,
  );
  return res;
}

const createLoanTx = async (params: CreateLoanTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default createLoanTx;