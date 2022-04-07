import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import { AvalancheChainConfig, Chain, PolygonChainConfig } from 'src/common/constants/network';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectCurrentWallet, updateWallet } from 'src/store/nftyLend';
import { isEvmChain } from '../utils';

function useCurrentWallet() {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet);

  const connectSolanaWallet = async () => {
    const el = document.getElementById('solButton');
    if (el) el.click();
  };

  const connectEvmWallet = async (chain: Chain) => {
    if (!window.ethereum) {
      throw new Error('Metamask not installed');
    }
    const providerOptions = { };
    const web3Modal = new Web3Modal({
      providerOptions,
    });
    const instance = await web3Modal.connect();

    const chainConfigs = {
      [Chain.Polygon]: PolygonChainConfig,
      [Chain.Avalanche]: AvalancheChainConfig,
    }
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chainConfigs[chain]],
    })
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainConfigs[chain]?.chainId }],
    });

    const provider = new ethers.providers.Web3Provider(instance);
    const accounts = await provider.listAccounts();
    dispatch(updateWallet({ address: accounts[0], chain }));
  };

  const connectWallet = async (chain: Chain) => {
    if (chain === Chain.Solana) {
      return connectSolanaWallet();
    } else if (isEvmChain(chain)) {
      return connectEvmWallet(chain);
    }
  };

  const switchChain = async (chain: Chain) => {
    if (isEvmChain(chain)) {
      return connectEvmWallet(chain);
    }
  };

  return {
    currentWallet,
    isConnected: currentWallet.address && currentWallet.chain,
    connectEvmWallet,
    connectSolanaWallet,
    connectWallet,
    switchChain,
  };
};

export { useCurrentWallet };