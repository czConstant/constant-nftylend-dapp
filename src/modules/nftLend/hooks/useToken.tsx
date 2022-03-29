import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import web3 from 'web3';
import { Chain } from 'src/common/constants/network';
import { getEvmBalance } from 'src/modules/evm/utils';
import { getBalanceSolToken } from 'src/modules/solana/utils';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectNftyLend, updateWallet } from 'src/store/nftyLend';
import { isEvmChain } from '../utils';
import { AssetNft } from '../models/nft';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { SolanaNft } from 'src/modules/solana/models/solanaNft';
import { EvmNft } from 'src/modules/evm/models/evmNft';
import { getEvmNftsByOwner } from 'src/modules/evm/api';
import localStore from 'src/common/services/localStore';

function useToken() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const dispatch = useAppDispatch();

  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

  const checkConnectedWallet = async() => {
    if (wallet?.publicKey) {
      dispatch(updateWallet({ address: wallet.publicKey.toString(), chain: Chain.Solana }));
      return;
    }
    if (!localStore.get('walletAddress') || !localStore.get('walletChain')) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      dispatch(updateWallet({ address: accounts[0], chain: localStore.get('walletChain') }));
    }
  }

  const getNftsByOwner = async(address: string, chain: Chain): Promise<Array<AssetNft>> => {
    let assets = [];
    if (chain === Chain.Solana) {
      const res = await getParsedNftAccountsByOwner({ publicAddress: address, connection });
      assets = res.map(e => {
        const nft = SolanaNft.parse(e);
        return nft;
      });
    } else {
      const res = await getEvmNftsByOwner(address, chain);
      assets = res.result.map((e: any) => {
        const nft = EvmNft.parse(e);
        nft.owner = address;
        return nft;
      });
    }
    return assets;
  }

  const getNativeBalance = async (): Promise<any> => {
    if (walletChain === Chain.Solana) {
      const solRes = await connection.getBalance(new PublicKey(walletAddress));
      return new BigNumber(solRes).dividedBy(LAMPORTS_PER_SOL).toNumber();
    } else if (isEvmChain(walletChain)) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      return web3.utils.fromWei(balance._hex);
    }
    throw new Error(`Chain ${walletChain} is not supported`)
  };

  const getBalance = async (contractAddress: string): Promise<any> => {
    if (walletChain === Chain.Solana) {
      return getBalanceSolToken(connection, walletAddress, contractAddress);
    } else if (isEvmChain(walletChain)) {
      const balance = await getEvmBalance(walletAddress, contractAddress);
      return web3.utils.toDecimal(balance._hex);
    }
    throw new Error(`Chain ${walletChain} is not supported`)
  };

  return { getBalance, getNativeBalance, getNftsByOwner, checkConnectedWallet };
};

export { useToken };