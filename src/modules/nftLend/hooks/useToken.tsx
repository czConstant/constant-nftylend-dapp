import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import web3 from 'web3';
import { Chain } from 'src/common/constants/network';
import { getEvmBalance } from 'src/modules/evm/utils';
import { getBalanceSolToken } from 'src/modules/solana/utils';
import { useAppSelector } from 'src/store/hooks';
import { selectNftyLend } from 'src/store/nftyLend';
import { isEvmChain } from '../utils';

function useToken() {
  const { connection } = useConnection();

  const walletAddress = useAppSelector(selectNftyLend).walletAddress;
  const walletChain = useAppSelector(selectNftyLend).walletChain;

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

  return { getBalance, getNativeBalance };
};

export { useToken };