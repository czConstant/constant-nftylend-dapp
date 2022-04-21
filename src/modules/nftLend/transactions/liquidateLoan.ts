import { Chain } from 'src/common/constants/network';
import LiquidateLoanEvmTransaction from 'src/modules/evm/transactions/liquidateLoan';
import LiquidateLoanNearTransaction from 'src/modules/near/transactions/liquidateLoan';
import LiquidateLoanTransaction from 'src/modules/solana/transactions/liquidateLoan';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { LiquidateLoanParams, TransactionOptions, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface LiquidateLoanTxParams extends LiquidateLoanParams {
  chain: Chain;
  walletAddress: string;
  options: TransactionOptions;
}

const solTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.solana?.connection || !params.options?.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const nftAssociated = await getAssociatedAccount(params.walletAddress, params.asset_contract_address);
  if (!nftAssociated) throw new Error('No associated account for asset');
  
  const transaction = new LiquidateLoanTransaction(
    params.options.solana.connection,
    params.options.solana.wallet,
  );
  const res = await transaction.run(
    params.asset_contract_address,
    params.loan_owner,
    params.loan_data_address,
    params.offer_data_address,
    params.currency_data_address,
    params.asset_data_address,
  );
  return res;
}

const evmTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.evm?.provider) throw new Error('No ethereum provider');

  const transaction = new LiquidateLoanEvmTransaction(
    params.chain,
    params.options.evm.provider,
  );
  const res = await transaction.run(params.loan_data_address);
  return res;
}

const nearTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  const transaction = new LiquidateLoanNearTransaction();
  const res = await transaction.run(params.asset_token_id, params.asset_contract_address);
  return res;
}

const liquidateLoanTx = async (params: LiquidateLoanTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (params.chain === Chain.Near) {
    return nearTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default liquidateLoanTx;