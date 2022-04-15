import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import web3 from 'web3';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';

import {  Chain } from 'src/common/constants/network';
import { getEvmBalance } from 'src/modules/evm/utils';
import { getBalanceSolToken } from 'src/modules/solana/utils';
import { SolanaNft } from 'src/modules/solana/models/solanaNft';
import { EvmNft } from 'src/modules/evm/models/evmNft';
import { getEvmNftsByOwner } from 'src/modules/evm/api';
import { getNearNftsByOwner } from 'src/modules/near/utils';
import { NearNft } from 'src/modules/near/models/nearNft';

import { isEvmChain } from '../utils';
import { AssetNft } from '../models/nft';
import { useCurrentWallet } from './useCurrentWallet';

function useToken() {
  const { connection } = useConnection();
  const { currentWallet } = useCurrentWallet();

  const getNftsByOwner = async(address: string, chain: Chain): Promise<Array<AssetNft>> => {
    let assets = [];
    if (chain === Chain.Solana) {
      const res = await getParsedNftAccountsByOwner({ publicAddress: address, connection });
      assets = res.map(e => {
        const nft = SolanaNft.parse(e);
        return nft;
      });
    } else if (chain === Chain.Near) {
      const res = await getNearNftsByOwner(currentWallet.address);
      assets = res.map(e => {
        const nft = NearNft.parse(e);
        return nft;
      });
    } else {
      const res = await getEvmNftsByOwner(address, chain);
      assets = res.result.map((e: any) => {
        const nft = EvmNft.parse(e, chain);
        nft.owner = address;
        return nft;
      });
    }
    return assets;
  }

  const getNativeBalance = async (): Promise<any> => {
    if (currentWallet.chain === Chain.Solana) {
      const solRes = await connection.getBalance(new PublicKey(currentWallet.address));
      return new BigNumber(solRes).dividedBy(LAMPORTS_PER_SOL).toNumber();
    } else if (currentWallet.chain === Chain.Near) {
      const nearRes = await window.nearWallet.account.getAccountBalance();
      return new BigNumber(nearRes.available).dividedBy(10 ** 24).toNumber();
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
    } else if (isEvmChain(currentWallet.chain)) {
      const balance = await getEvmBalance(currentWallet.address, contractAddress);
      return web3.utils.toDecimal(balance._hex);
    }
    throw new Error(`Chain ${currentWallet.chain} is not supported`)
  };

  return { getBalance, getNativeBalance, getNftsByOwner };
};

export { useToken };