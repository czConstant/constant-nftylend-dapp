import { Chain } from 'src/common/constants/network';
import MakeOfferEvmTransaction from 'src/modules/evm/transactions/makeOffer';
import MakeOfferNearTransaction from 'src/modules/near/transactions/makeOffer';
import MakeOfferNearNativeTransaction from 'src/modules/near/transactions/makeOfferNative';
import MakeOfferTransaction from 'src/modules/solana/transactions/makeOffer';
import { getAssociatedAccount } from 'src/modules/solana/utils';
import { MakeOfferParams, TransactionOptions, TransactionResult } from '../models/transaction';
import { isEvmChain, isNativeToken } from '../utils';

interface MakeOfferTxParams extends MakeOfferParams {
  chain: Chain;
  walletAddress: string;
  options?: TransactionOptions;
}

const solTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  if (!params.options?.solana?.connection || !params.options?.solana?.wallet) throw new Error('No connection to Solana provider');
    
  const currencyAssociated = await getAssociatedAccount(params.walletAddress, params.currency_contract_address);
  if (!currencyAssociated) throw new Error('No associated account for currency');

  const transaction = new MakeOfferTransaction(
    params.options.solana.connection,
    params.options.solana.wallet,
  );
  const res = await transaction.run(
  params.currency_contract_address,
    currencyAssociated,
    params.loan_owner,
    params.loan_data_address,
    params.principal * 10 ** params.currency_decimal,
    params.rate * 10000,
    params.duration,
    Math.floor(Date.now() / 1000) + 7 * 86400,
  );
  return res;
}

const evmTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  if (!params.options?.evm?.provider) throw new Error('No ethereum provider');

  const transaction = new MakeOfferEvmTransaction(
    params.chain,
    params.options.evm.provider,
  );
  const res = await transaction.run(
    params.principal,
    params.asset_token_id,
    params.duration,
    params.rate,
    params.asset_contract_address,
    params.currency_contract_address,
    params.currency_decimal,
    params.lender,
    params.loan_id,
    params.available_in,
  );
  return res;
}

const nearTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  let transaction = new MakeOfferNearTransaction()
  if (isNativeToken(params.currency_contract_address, Chain.Near)) {
    transaction = new MakeOfferNearNativeTransaction()
  }
  const res = await transaction.run(
    params.asset_token_id,
    params.asset_contract_address,
    params.currency_contract_address,
    params.currency_decimal,
    params.principal,
    params.rate,
    params.duration,
    params.available_in,
  );
  return res;
}

const makeOfferTx = async (params: MakeOfferTxParams): Promise<TransactionResult> => {
  if (params.chain === Chain.Solana) {
    return solTx(params)
  } else if (params.chain === Chain.Near) {
    return nearTx(params)
  } else if (isEvmChain(params.chain)) {
    return evmTx(params);
  }
  throw new Error('Chain not supported');
};

export default makeOfferTx;