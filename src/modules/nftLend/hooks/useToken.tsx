import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import web3 from 'web3';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'

import {  Chain } from 'src/common/constants/network';
import { getEvmBalance } from 'src/modules/evm/utils';
import { getBalanceSolToken } from 'src/modules/solana/utils';
import { SolanaNft } from 'src/modules/solana/models/solanaNft';
import { getEvmNftsByOwner } from 'src/modules/evm/api';
import { getBalanceNearToken, getNearBalance, getNearNftsByOwner, nearViewFunction } from 'src/modules/near/utils';

import { isEvmChain, isNativeToken } from '../utils';
import { AssetNft } from '../models/nft';
import { useCurrentWallet } from './useCurrentWallet';
import { Currency } from '../models/api';

function useToken() {
  const { connection } = useConnection();
  const { currentWallet } = useCurrentWallet();

  const getNftsByOwner = async(): Promise<Array<AssetNft>> => {
    let assets = [];
    if (currentWallet.chain === Chain.Solana) {
      const res = await getParsedNftAccountsByOwner({ publicAddress: currentWallet.address, connection });
      assets = res.map(e => {
        const nft = SolanaNft.parse(e);
        return nft;
      });
    } else if (currentWallet.chain === Chain.Near) {
      assets = await getNearNftsByOwner(currentWallet.address);
    } else {
      assets = await getEvmNftsByOwner(currentWallet.address, currentWallet.chain);
    }
    return assets;
  }

  const getNativeBalance = async (): Promise<any> => {
    if (currentWallet.chain === Chain.Solana) {
      const solRes = await connection.getBalance(new PublicKey(currentWallet.address));
      return new BigNumber(solRes).dividedBy(LAMPORTS_PER_SOL).toNumber();
    } else if (currentWallet.chain === Chain.Near) {
      const nearRes = await getNearBalance(currentWallet.address);
      return nearRes;
    } else if (isEvmChain(currentWallet.chain)) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(currentWallet.address);
      return web3.utils.fromWei(balance._hex);
    }
    throw new Error(`Chain ${currentWallet.chain} is not supported`)
  };

  const getBalance = async (contractAddress: string): Promise<any> => {
    if (currentWallet.chain === Chain.Solana) {
      return getBalanceSolToken(connection, currentWallet.address, contractAddress);
    } else if (currentWallet.chain === Chain.Near) {
      return getBalanceNearToken(currentWallet.address, contractAddress);
    } else if (isEvmChain(currentWallet.chain)) {
      const balance = await getEvmBalance(currentWallet.address, contractAddress);
      return web3.utils.toDecimal(balance._hex);
    }
    throw new Error(`Chain ${currentWallet.chain} is not supported`)
  };

  const getCurrencyBalance = async (currency?: Currency): Promise<number> => {
    if (!currency) return 0
    if (String(currency.network).toLowerCase() !== currentWallet.chain.toLowerCase()) {
      return 0
    }
    if (isNativeToken(currency.contract_address, currency.contract_address)) {
      return getNativeBalance()
    }
    const res = await getBalance(currency.contract_address)
    return new BigNumber(res).dividedBy(10 ** currency?.decimals).toNumber()
  }

  return { getBalance, getNativeBalance, getCurrencyBalance, getNftsByOwner };
};

export { useToken };