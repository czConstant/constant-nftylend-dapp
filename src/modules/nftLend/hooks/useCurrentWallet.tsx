import { ethers } from 'ethers';

import { AvalancheChainConfig, Chain, PolygonChainConfig } from 'src/common/constants/network';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { clearWallet, selectCurrentWallet, updateWallet } from 'src/store/nftyLend';
import { isEvmChain } from '../utils';
import { CryptoWallet, getEvmProvider } from 'src/common/constants/wallet';

function useCurrentWallet() {
  const dispatch = useAppDispatch();
  const currentWallet = useAppSelector(selectCurrentWallet);

  const connectSolanaWallet = async () => {
    const el = document.getElementById('solButton');
    if (el) el.click();
  };

  const connectEvmWallet = async (chain: Chain, wallet?: CryptoWallet) => {
    const chainConfigs = {
      [Chain.Polygon]: PolygonChainConfig,
      [Chain.Avalanche]: AvalancheChainConfig,
    }

    const provider = getEvmProvider(wallet);
    window.evmProvider = provider;
    await provider.send(
      'wallet_addEthereumChain',
      [ chainConfigs[chain] ],
    );
    await provider.send(
      'wallet_switchEthereumChain',
      [{ chainId: chainConfigs[chain]?.chainId }],
    );
    await provider.send('eth_requestAccounts', []);
    const accounts = await provider.listAccounts();
    dispatch(updateWallet({ address: accounts[0], chain, wallet, name: wallet }));
  };

  const connectWallet = async (chain: Chain, wallet?: CryptoWallet) => {
    if (chain === Chain.Solana) {
      return connectSolanaWallet();
    } else if (isEvmChain(chain)) {
      return connectEvmWallet(chain, wallet);
    }
  };

  const disconnectWallet = async () => {
    dispatch(clearWallet());
  };

  const switchChain = async (chain: Chain) => {
    if (isEvmChain(chain)) {
      return connectEvmWallet(chain);
    }
  };

  return {
    currentWallet,
    isConnected: currentWallet.address && currentWallet.chain,
    connectSolanaWallet,
    connectWallet,
    disconnectWallet,
    switchChain,
  };
};

export { useCurrentWallet };