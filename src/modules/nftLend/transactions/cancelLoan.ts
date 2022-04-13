import { Chain } from 'src/common/constants/network';
import CancelLoanEvmTransaction from 'src/modules/evm/transactions/cancelLoan';
import CancelLoanTransaction from 'src/modules/solana/transactions/cancelLoan';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { CancelLoanParams, TransactionOptions, TransactionResult } from '../models/transaction';
import { isEvmChain } from '../utils';

interface CancelLoanTxParams extends CancelLoanParams {
  chain: Chain;
  walletAddress: string;
  options?: TransactionOptions
}

const solTx = async (params: CancelLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.solana?.connection || !params.options?.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const nftAssociated = await getAssociatedAccount(params.walletAddress, params.asset_contract_address);
  if (!nftAssociated) throw new Error('No associated account for asset');
  
  const transaction = new CancelLoanTransaction(
    params.options.solana.connection,
    params.options.solana.wallet,
  );
  const res = await transaction.run(
    nftAssociated,
    params.loan_data_address,
    params.asset_contract_address
  );
  return res;
}

const evmTx = async (params: CancelLoanTxParams): Promise<TransactionResult> => {
  if (!params.options?.evm?.provider) throw new Error('No ethereum provider');

  const transaction = new CancelLoanEvmTransaction(
    params.chain,
    params.options.evm.provider,
  );
  const res = await transaction.run(params.nonce);
  return res;
}

const cancelLoanTx = async (params: CancelLoanTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default cancelLoanTx;